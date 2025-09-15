
***
# base
```c#
SqlSugarClient db = new SqlSugarClient(new ConnectionConfig()
{
    ConnectionString = "Data Source=.;Initial Catalog=formula;Password=123456;User ID=sa;Trust Server Certificate=True",
    DbType = DbType.SqlServer,
    IsAutoCloseConnection = true
},
db => { 
    //给逻辑删除配置过滤条件
    db.QueryFilter.AddTableFilter<Drivers>(x => x.IsDeleted == false);
}
);
db.Aop.OnLogExecuting = (sql, pars) =>
{
    Console.ForegroundColor=ConsoleColor.Green;
    //Console.WriteLine(UtilMethods.GetNativeSql(sql,pars));
    Console.WriteLine(UtilMethods.GetSqlString(DbType.SqlServer,sql,pars));//can excute in ssms 
    //Console.WriteLine($"[log]: {sql}");
    //foreach (var p in pars)
    //{
    //    Console.WriteLine($"    Parameter: {p.ParameterName}, Value: {p.Value}");
    //}
    Console.ResetColor();
    Console.WriteLine("=================================================");
};

//表=>class
db.DbFirst.Where(x => x.StartsWith("abc")).CreateClassFile("C:\\Models", "Models");

//class=>表
db.CodeFirst.SetStringDefaultLength(200).InitTables(typeof(Drivers));

//查询所有
var list = db.Queryable<Drivers>().ToList();
Console.WriteLine(list.Count);

//条件查询
var list = db.Queryable<Drivers>().Where(x => x.Id == 1).ToList();
Console.WriteLine(list[0].ToString());

//并发验证sqlserver时间戳实现乐观锁
var res = db.Queryable<Drivers>().Where(x => x.Id == 1).ToList();
var ress = db.Updateable(res).IsEnableUpdateVersionValidation().ExecuteCommand();
//对应timestamp字段需加上属性
[SugarColumn(
	IsEnableUpdateVersionValidation =true,
	IsOnlyIgnoreInsert=true,
	IsOnlyIgnoreUpdate =true,
	ColumnDataType ="timestamp")]
public byte[] ufts { get; set; }

//联表查询
var result = db.Queryable<Drivers>()
			.LeftJoin<Team>((d, t) => d.Team == t.Name).ToList();
Console.WriteLine(JsonSerializer.Serialize(result));

//分页
int totalCount = 0;
//var result = db.Queryable<Drivers>().ToPageList(1, 2, ref totalCount);
var result = db.Queryable<Drivers>().ToOffsetPage(1, 2, ref totalCount);
Console.WriteLine(JsonSerializer.Serialize(result));
Console.WriteLine(totalCount);

RefAsync<int> total = 0;
db.Queryable<Drivers>().ToPageListAsync(1, 2, total);//ToPageAsync

//逻辑删除
db.Deleteable<Drivers>().In(1).IsLogic().ExecuteCommand();
```


# 临时表查询替代in
#### in条件+目标表=>返回目标表
```c#
using SqlSugar;
using System.Linq.Expressions;

public class SqlSugarHelper
{
    private readonly ISqlSugarClient _db;

    public SqlSugarHelper(ISqlSugarClient db)
    {
        _db = db;
    }

    /// <summary>
    /// 使用临时表高效查询，适用于IN条件包含大量匹配值的情况
    /// </summary>
    /// <typeparam name="T">目标实体类型</typeparam>
    /// <typeparam name="TKey">匹配列的类型（如int, string, Guid等）</typeparam>
    /// <param name="idList">用于匹配的ID列表</param>
    /// <param name="idExpression">用于指定匹配列的Lambda表达式，例如：p => p.ProductID</param>
    /// <returns>返回匹配到的实体列表</returns>
    public async Task<List<T>> GetListByTempTableAsync<T, TKey>(
        List<TKey> idList,
        Expression<Func<T, TKey>> idExpression) where T : class, new()
    {
        if (idList == null || !idList.Any())
        {
            return new List<T>();
        }

        // 创建一个临时表
        var tempTableName = "#TempIds_" + Guid.NewGuid().ToString("N");
        await _db.Ado.ExecuteCommandAsync($"CREATE TABLE {tempTableName} (Id {GetDbType<TKey>()});");

        // 批量插入ID到临时表
        var bulkCopyData = idList.Select(id => new { Id = id }).ToList();
        await _db.Ado.InsertBulkAsync(bulkCopyData, tempTableName);

        // 构造JOIN查询
        var query = _db.Queryable<T>()
                       .With(SqlWith.NoLock) // 可选，根据需要添加
                       .LeftJoin(tempTableName, $"it.{GetColumnName(idExpression)} = Temp.Id")
                       .Select<T>("it.*"); // 这里使用 "it.*" 来选择所有列

        // 考虑到SqlSugar的动态表名和表达式，也可以手动拼接SQL
        // 或者使用更动态的 SqlSugar 表达式
        var sql = query.ToSql().First().Key;
        return await _db.Ado.SqlQueryAsync<T>(sql);
    }

    /// <summary>
    /// 根据类型获取SQL Server列类型
    /// </summary>
    private string GetDbType<TKey>()
    {
        if (typeof(TKey) == typeof(int))
            return "int";
        if (typeof(TKey) == typeof(long))
            return "bigint";
        if (typeof(TKey) == typeof(string))
            return "nvarchar(max)"; // 或者更精确的类型
        if (typeof(TKey) == typeof(Guid))
            return "uniqueidentifier";

        throw new NotSupportedException($"Unsupported key type: {typeof(TKey).Name}");
    }

    /// <summary>
    /// 根据Lambda表达式获取列名
    /// </summary>
    private string GetColumnName<T, TKey>(Expression<Func<T, TKey>> idExpression)
    {
        var memberExpression = (MemberExpression)idExpression.Body;
        return memberExpression.Member.Name;
    }
}


//=================================================

public class Product
{
    [SugarColumn(IsPrimaryKey = true)]
    public int Id { get; set; }
    public string ProductName { get; set; }
    // ... 其他属性
}

// 在你的服务或控制器中
var productIds = new List<int> { 1, 5, 10, 20, /* ... 大量ID */ };

// 实例化辅助类
var sqlSugarHelper = new SqlSugarHelper(_db); // _db 是 ISqlSugarClient 实例

// 调用封装的方法
var products = await sqlSugarHelper.GetListByTempTableAsync<Product, int>(productIds, p => p.Id);

// 现在 products 列表包含了所有匹配的产品实体



```



#### 临时表+目标表=>返回合并表
```c#
using SqlSugar;
using System.Linq.Expressions;

public class SqlSugarHelper
{
    private readonly ISqlSugarClient _db;

    public SqlSugarHelper(ISqlSugarClient db)
    {
        _db = db;
    }

    /// <summary>
    /// 使用临时表高效查询，将T1列表与T2表联接，结果映射到T3实体。
    /// </summary>
    /// <typeparam name="T1">临时表实体类型</typeparam>
    /// <typeparam name="T2">目标表实体类型</typeparam>
    /// <typeparam name="T3">结果实体类型</typeparam>
    /// <param name="list1">要插入临时表的T1实体列表</param>
    /// <param name="joinExpression">联接条件表达式，例如：(t1, t2) => t1.Field1 == t2.Field2</param>
    /// <returns>返回映射到T3的实体列表</returns>
    public async Task<List<T3>> JoinWithTempTableAsync<T1, T2, T3>(
        List<T1> list1,
        Expression<Func<T1, T2, bool>> joinExpression)
        where T1 : class, new()
        where T2 : class, new()
        where T3 : class, new()
    {
        if (list1 == null || !list1.Any())
        {
            return new List<T3>();
        }

        // 1. 创建临时表并批量插入数据
        var tempTableName = "#Temp_" + Guid.NewGuid().ToString("N");
        
        // 使用 SqlSugar 的工具类获取表名和创建表结构
        var entityInfo = _db.EntityMaintenance.GetEntityInfo<T1>();
        var createTableSql = $"CREATE TABLE {tempTableName} ({string.Join(",", entityInfo.Columns.Select(c => $"{c.DbColumnName} {GetDbType(c.PropertyInfo.PropertyType)}"))})";
        
        // 实际创建临时表
        await _db.Ado.ExecuteCommandAsync(createTableSql);

        // 批量插入数据到临时表
        await _db.Ado.InsertBulkAsync(list1, tempTableName);

        // 2. 构建联接查询
        // 使用 SqlSugar 的表达式联接语法，它能自动解析联接条件
        var query = _db.Queryable<T1>(tempTableName)
                       .LeftJoin<T2>(joinExpression)
                       .Select<T3>();

        // 3. 执行查询并返回结果
        return await query.ToListAsync();
    }

    // 辅助方法：将C#类型映射到SQL Server数据库类型
    private string GetDbType(Type type)
    {
        if (type == typeof(int)) return "int";
        if (type == typeof(string)) return "nvarchar(max)";
        if (type == typeof(Guid)) return "uniqueidentifier";
        // ...根据需要添加更多类型映射
        return "nvarchar(max)";
    }
}


//=============================================================

var results = await sqlSugarHelper.JoinWithTempTableAsync<TempData, TargetData, ResultData>( tempDataList, (t1, t2) => t1.Field1 == t2.Field2 );

```

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
    private static string GetDbType(Type type)
	{
		if (type == typeof(int)) return "int";
		if (type == typeof(int?)) return "int";
		if (type == typeof(long)) return "bigint";
		if (type == typeof(long?)) return "bigint";
		if (type == typeof(bool)) return "bit";
		if (type == typeof(bool?)) return "bit";
		if (type == typeof(DateTime)) return "datetime";
		if (type == typeof(DateTime?)) return "datetime";
		if (type == typeof(decimal)) return "decimal(18,2)";
		if (type == typeof(decimal?)) return "decimal(18,2)";
		if (type == typeof(double)) return "float";
		if (type == typeof(double?)) return "float";
		if (type == typeof(float)) return "real";
		if (type == typeof(float?)) return "real";
		if (type == typeof(string)) return "nvarchar(max)";
		if (type == typeof(Guid)) return "uniqueidentifier";
		if (type == typeof(Guid?)) return "uniqueidentifier";
		if (type == typeof(byte)) return "tinyint";
		if (type == typeof(byte?)) return "tinyint";
		if (type == typeof(byte[])) return "varbinary(max)";
		if (type == typeof(short)) return "smallint";
		if (type == typeof(short?)) return "smallint";
		if (type == typeof(char)) return "nchar(1)";
		if (type == typeof(char?)) return "nchar(1)";
		if (type == typeof(TimeSpan)) return "time";
		if (type == typeof(TimeSpan?)) return "time";
		return "nvarchar(max)";
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
   	public List<T3> JoinWithTempTable<T1, T2, T3>(
List<T1> list1,
Expression<Func<T1, T2, bool>> joinExpression)
where T1 : class, new()
where T2 : class, new()
where T3 : class, new()
	{
		var result = new List<T3>();
		if (list1 == null || !list1.Any())
		{
			return result;
		}
		var tempTableName = "#Temp_" + Guid.NewGuid().ToString("N");

		_db.Ado.UseTran(() =>
		{
			var entityInfo = _db.EntityMaintenance.GetEntityInfo<T1>();
			var createTableSql = $"CREATE TABLE {tempTableName} ({string.Join(",", entityInfo.Columns.Select(c => $"{c.DbColumnName} {GetDbType(c.PropertyInfo.PropertyType)}"))})";

			_db.Ado.ExecuteCommand(createTableSql);
			_db.Insertable(list1).AS(tempTableName).ExecuteCommand();

			result = _db.Queryable<T1>().AS<T1>(tempTableName)
						   .LeftJoin<T2>(joinExpression)
						   .Select<T3>().ToList();
			_db.Ado.ExecuteCommand($"DROP TABLE IF EXISTS {tempTableName}");
		});
		return result;
	}
}
```
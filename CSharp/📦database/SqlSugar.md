
***
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
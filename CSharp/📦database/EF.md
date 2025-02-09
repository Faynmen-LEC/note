***

安装程序集`【Pomelo.EntityFrameworkCore.SqlServer】【Microsoft.EntityFrameworkCore.Tools】`
  
生成migration文件：`Add-Migration <record>  ``
更新数据库：`Update-Database`

```c#
public class DataContext :DbContext
{
    public DataContext(DbContextOptions<DataContext> options):base(options) 
    {
        
    }

    public DbSet<Driver>  Drivers { get; set; }
}

```

```c#
builder.Services.AddDbContext<DataContext>(options =>
{	
	options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
});
```

```json
"ConnectionStrings": {
  "DefaultConnection": "Data Source=127.0.0.1;DataBase=formula;User ID=sa;Password=123456;TrustServerCertificate=true;"
}
```


***

```c#
public class DataContext :DbContext
{
    portected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder){
	    optionsBuilder.UseSqlServer(
		    "Data Source=(localdb);Initial Catelog=formula");
    }

    public DbSet<Driver>  Drivers { get; set; }
}

```

```c#
using(DataContext context =new DataContext()){
	context.Database.EnsureCreated(); //创建数据库和表
}
```
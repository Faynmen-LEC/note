***

安装程序集`【Pomelo.EntityFrameworkCore.SqlServer】【Microsoft.EntityFrameworkCore.Tools】`
  
生成migration文件：`Add-Migration <record> 
更新数据库：`Update-Database`

```c#
public class DataContext :DbContext
{
    public DataContext(DbContextOptions<DataContext> options):base(options) 
    {
        
    }

    public DbSet<Person>  Person { get; set; }
}

```

```c#
//sqlserver
builder.Services.AddDbContext<DataContext>(options =>
{	
	options.UseSqlServer(
		builder.Configuration.GetConnectionString("DefaultConnection"));
});

//mysql
builder.Services.AddDbContext<DataContext>(options =>
	options.UseMySql(
		builder.Configuration.GetConnectionString("MySqlConnection"),
		new MySqlServerVersion(new Version(8, 0, 23)
		)
	)
);

builder.Services.AddScoped<DatabaseService>();

```

```json
"ConnectionStrings": {
  "DefaultConnection": "Data Source=127.0.0.1;DataBase=formula;User ID=sa;Password=123456;TrustServerCertificate=true;"
}
```

```c#
public class DatabaseService
{
	private readonly DataContext _context;

	public DatabaseService(DataContext context)
	{
		_context = context;
	}

	public async Task<List<Person>> GetAllPersonsAsync()
	{
		return await _context.Persons.ToListAsync();
	}
}
```

```c#
[ApiController]
[Route("api/[controller]")]
public class PersonsController : ControllerBase
{
	private readonly DatabaseService _databaseService;

	public PersonsController(DatabaseService databaseService)
	{
		_databaseService = databaseService;
	}

	[HttpGet]
	public async Task<ActionResult<IEnumerable<Person>>> GetPersons()
	{
		var persons = await _databaseService.GetAllPersonsAsync();
		return Ok(persons);
	}
}
```


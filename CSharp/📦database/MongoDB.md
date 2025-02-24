***

```c#
builder.Services.AddSingleton<MongoDBService>(sp =>
	new MongoDBService(
		builder.Configuration["MongoDB:ConnectionString"],
		builder.Configuration["MongoDB:DatabaseName"],
		builder.Configuration["MongoDB:CollectionName"]));
```

```c#
public class MongoDBService
{
	private readonly IMongoCollection<Person> _persons;

	public MongoDBService(string connectionString, string databaseName,string collectionName)
	{
		var client = new MongoClient(connectionString);
		var database = client.GetDatabase(databaseName);
		_persons = database.GetCollection<Person>(collectionName);
	}
	
	public async Task<List<Person>> GetPersonsAsync()
	{
		return await _persons.Find(person => true).ToListAsync();
	}
}
```

```c#
[ApiController]
[Route("[controller]")]
public class PersonsController : ControllerBase
{
	private readonly MongoDBService _mongoDBService;

	public PersonsController(MongoDBService mongoDBService)
	{
		_mongoDBService = mongoDBService;
	}

	[HttpGet]
	public async Task<ActionResult<IEnumerable<Person>>> GetPersons()
	{
		var persons = await _mongoDBService.GetPersonsAsync();
		return Ok(persons);
	}
}
```

```json
{
	"MongoDB": 
	{ 
		"ConnectionString": "your_connection_string",
		 "DatabaseName": "your_database_name", 
		 "CollectionName": "your_collection_name" 
	 } 
}
```
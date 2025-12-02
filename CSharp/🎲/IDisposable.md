
***
# 1. 非托管资源类IDisposable对象

### 文件操作相关
```c#
// FileStream - 文件句柄是非托管资源 
using (FileStream fs = new FileStream("file.txt", FileMode.Open)) 
{ // 使用文件流 
} 
// StreamReader/StreamWriter 包装FileStream时也需要释放 
using (StreamReader reader = new StreamReader("file.txt")) 
{ 
	string content = reader.ReadToEnd(); 
}
```


### 数据库相关
```c#
// SqlConnection - 数据库连接使用非托管资源 
using (SqlConnection connection = new SqlConnection(connectionString)) 
{ 
	connection.Open(); // 执行数据库操作 
} 
// SqlCommand也实现了IDisposable 
using (SqlCommand command = new SqlCommand(sql, connection)) 
{ // 执行命令 
}
```

### 网络通信相关
```c#
// HttpClient虽然通常作为单例使用，但也实现了IDisposable 
using (HttpClient client = new HttpClient()) 
{ 
	var response = await client.GetAsync("http://example.com"); 
} 
// TcpClient、UdpClient等网络客户端 
using (TcpClient client = new TcpClient()) 
{ // 网络通信 
}

//单例
//===========================================
// 在应用启动时创建一次 
private static readonly HttpClient httpClient = new HttpClient(); 
// 在各处重复使用同一个实例 
public async Task<string> GetDataAsync() 
{ 
	var response = await httpClient.GetAsync("http://example.com"); 
	return await response.Content.ReadAsStringAsync(); 
}


// IHttpClientFactory
//===========================================
// 注册服务 
services.AddHttpClient<MyService>(); // 使用注入的HttpClient 

public class MyService 
{ 
	private readonly HttpClient _httpClient; 
	public MyService(HttpClient httpClient) 
	{ 
		_httpClient = httpClient; 
	} 
	public async Task<string> GetDataAsync() 
	{ 
		var response = await _httpClient.GetAsync("http://example.com"); 
		return await response.Content.ReadAsStringAsync(); 
	} 
}

```

# 2. 稀缺性资源类IDisposable对象
### 数据库连接池相关
```c#
// DbContext (Entity Framework) 
using (var context = new MyDbContext()) 
{ 
	var data = context.Users.ToList(); // 使用数据 
} 
// IDbConnection的各种实现 
using (IDbConnection connection = new SqlConnection(connectionString)) 
{ // 连接是稀缺资源，连接池大小有限 
}
```
### 并发和同步相关
```c#
// SemaphoreSlim用于限制并发访问 
using (SemaphoreSlim semaphore = new SemaphoreSlim(3, 3)) 
{ // 控制并发访问数量 
} 
// CancellationTokenSource 
using (CancellationTokenSource cts = new CancellationTokenSource()) 
{ // 取消令牌源 
}
```
### 图形和多媒体相关
```c#
// Bitmap图像对象 
using (Bitmap bitmap = new Bitmap("image.jpg")) 
{ // 图像处理 
} 
// Graphics对象 
using (Graphics g = Graphics.FromImage(bitmap)) 
{ // 绘图操作 
}
```
### 加密和安全相关
```c#
// 各种加密算法提供者 
using (Aes aes = Aes.Create()) 
{ // 加密解密操作 
} 
using (RSACryptoServiceProvider rsa = new RSACryptoServiceProvider()) 
{ // RSA加密操作 
}
```
### 内存和缓冲区相关
```c#
// MemoryStream通常只使用托管内存，但仍是IDisposable 
using (MemoryStream ms = new MemoryStream()) 
{ // 内存流操作 
} 
// 如果使用非托管内存缓冲区 
using (var buffer = new UnmanagedMemoryStream(...)) 
{ // 使用非托管内存 
}
```
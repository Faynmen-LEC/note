# IHttpClientFactory


```c#


services.AddHttpClient<IOTService>();


public class MyService
{
    private readonly HttpClient _httpClient;

    public MyService(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task GetDataAsync()
    {
        var client = _httpClient.CreateClient();
        var response = await client.GetAsync("https://api.example.com");
        // ... 处理响应
    }
}
```



# 静态单例

```C#
public class ApiClient
{
    // 静态实例，整个应用生命周期只创建一个
    private static readonly HttpClient _client = new HttpClient();

    public async Task CallApi()
    {
        var result = await _client.GetAsync("https://api.example.com");
    }
}
```
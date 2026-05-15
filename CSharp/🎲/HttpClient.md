# IHttpClientFactory


```c#


services.AddHttpClient<IOTService>();


public class HttpHelper
{
	private readonly IHttpClientFactory _httpClientFactory;

	public HttpHelper(IHttpClientFactory httpClientFactory)
	{
		_httpClientFactory = httpClientFactory;
	}
	
	public async Task<string> HttpGetAsync(string url, string token = null)
	{
		try
		{
			using var client = _httpClientFactory?.CreateClient() ?? new HttpClient();

			if (!string.IsNullOrEmpty(token))
			{
				client.DefaultRequestHeaders.Authorization =
					new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);
			}

			var response = await client.GetAsync(url);
			response.EnsureSuccessStatusCode();
			return await response.Content.ReadAsStringAsync();
		}
		catch (Exception ex)
		{
			throw new Exception($"HTTP GET async request failed: {ex.Message}", ex);
		}
	}


	public async Task<string> HttpPostAsync(string url, string jsonBody, string token = null)
	{
		try
		{
			using var client = _httpClientFactory?.CreateClient() ?? new HttpClient();

			if (!string.IsNullOrEmpty(token))
			{
				client.DefaultRequestHeaders.Authorization =
					new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);
			}

			var content = new StringContent(jsonBody, Encoding.UTF8, "application/json");
			var response = await client.PostAsync(url, content);
			response.EnsureSuccessStatusCode();
			return await response.Content.ReadAsStringAsync();
		}
		catch (Exception ex)
		{
			throw new Exception($"HTTP POST async request failed: {ex.Message}", ex);
		}
	}

	public async Task<string> HttpPostAsync(string url, string jsonBody, string token = null, Dictionary<string, string> headers = null)
	{
		try
		{
			using var client = _httpClientFactory?.CreateClient() ?? new HttpClient();

			if (!string.IsNullOrEmpty(token))
			{
				client.DefaultRequestHeaders.Authorization =
					new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);
			}
			if (headers != null)
			{
				foreach (var header in headers)
				{
					client.DefaultRequestHeaders.TryAddWithoutValidation(header.Key, header.Value);
				}
			}

			var content = new StringContent(jsonBody, Encoding.UTF8, "application/json");
			var response = await client.PostAsync(url, content);
			response.EnsureSuccessStatusCode();
			return await response.Content.ReadAsStringAsync();
		}
		catch (Exception ex)
		{
			throw new Exception($"HTTP POST async request failed: {ex.Message}", ex);
		}
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
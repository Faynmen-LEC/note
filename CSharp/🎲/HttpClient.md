# IHttpClientFactory


```c#


services.AddHttpClient();


public class HttpHelper
{
	private readonly IHttpClientFactory _httpClientFactory;

	public HttpHelper(IHttpClientFactory httpClientFactory)
	{
		_httpClientFactory = httpClientFactory;
	}

	public string HttpGet(string url, string token = null)
	{
		try
		{
			var client = _httpClientFactory.CreateClient();

			if (!string.IsNullOrEmpty(token))
			{
				client.DefaultRequestHeaders.Authorization =
					new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);
			}

			var response = client.GetAsync(url).GetAwaiter().GetResult();
			var responseBody = response.Content.ReadAsStringAsync().GetAwaiter().GetResult();
			EnsureSuccess(response, responseBody, "GET", url);
			return responseBody;
		}
		catch (HttpRequestException)
		{
			throw;
		}
		catch (Exception ex)
		{
			throw new HttpRequestException($"HTTP GET 请求异常 [{url}]: {ex.Message}", ex);
		}
	}


	public string HttpPost(string url, string jsonBody, string token = null)
	{
		try
		{
			var client = _httpClientFactory.CreateClient();

			if (!string.IsNullOrEmpty(token))
			{
				client.DefaultRequestHeaders.Authorization =
					new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);
			}

			var content = new StringContent(jsonBody, Encoding.UTF8, "application/json");
			var response = client.PostAsync(url, content).GetAwaiter().GetResult();
			var responseBody = response.Content.ReadAsStringAsync().GetAwaiter().GetResult();
			EnsureSuccess(response, responseBody, "POST", url);
			return responseBody;
		}
		catch (HttpRequestException)
		{
			throw;
		}
		catch (Exception ex)
		{
			throw new HttpRequestException($"HTTP POST 请求异常 [{url}]: {ex.Message}", ex);
		}
	}



	public async Task<string> HttpGetAsync(string url, string token = null)
	{
		try
		{
			var client = _httpClientFactory.CreateClient();

			if (!string.IsNullOrEmpty(token))
			{
				client.DefaultRequestHeaders.Authorization =
					new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);
			}

			var response = await client.GetAsync(url);
			var responseBody = await response.Content.ReadAsStringAsync();
			EnsureSuccess(response, responseBody, "GET", url);
			return responseBody;
		}
		catch (HttpRequestException)
		{
			throw;
		}
		catch (TaskCanceledException ex)
		{
			throw new HttpRequestException($"HTTP GET 请求超时 [{url}]", ex);
		}
		catch (Exception ex)
		{
			throw new HttpRequestException($"HTTP GET 请求异常 [{url}]: {ex.Message}", ex);
		}
	}

	public async Task<string> HttpPostAsync(string url, string jsonBody, string token = null, Dictionary<string, string> headers = null)
	{
		try
		{
			var client = _httpClientFactory.CreateClient();

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
			var responseBody = await response.Content.ReadAsStringAsync();
			EnsureSuccess(response, responseBody, "POST", url);
			return responseBody;
		}
		catch (HttpRequestException)
		{
			throw;
		}
		catch (TaskCanceledException ex)
		{
			throw new HttpRequestException($"HTTP POST 请求超时 [{url}]", ex);
		}
		catch (Exception ex)
		{
			throw new HttpRequestException($"HTTP POST 请求异常 [{url}]: {ex.Message}", ex);
		}
	}

	public async Task<string> HttpPutAsync(string url, string jsonBody, string token = null)
	{
		try
		{
			var client = _httpClientFactory.CreateClient();

			if (!string.IsNullOrEmpty(token))
			{
				client.DefaultRequestHeaders.Authorization =
					new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);
			}

			var content = new StringContent(jsonBody, Encoding.UTF8, "application/json");
			var response = await client.PutAsync(url, content);
			var responseBody = await response.Content.ReadAsStringAsync();
			EnsureSuccess(response, responseBody, "PUT", url);
			return responseBody;
		}
		catch (HttpRequestException)
		{
			throw;
		}
		catch (TaskCanceledException ex)
		{
			throw new HttpRequestException($"HTTP PUT 请求超时 [{url}]", ex);
		}
		catch (Exception ex)
		{
			throw new HttpRequestException($"HTTP PUT 请求异常 [{url}]: {ex.Message}", ex);
		}
	}

	private static void EnsureSuccess(HttpResponseMessage response, string responseBody, string method, string url)
	{
		if (!response.IsSuccessStatusCode)
		{
			throw new HttpRequestException(
				$"HTTP {method} 请求失败 [{url}] " +
				$"状态码: {(int)response.StatusCode} {response.ReasonPhrase}, " +
				$"响应体: {responseBody}");
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

***

```csharp

public class TokenManager
{

	public AS_RSTokenManager(HttpHelper httpHelper)
	{
		_httpHelper = httpHelper;
	}

	private string _accessToken;
	private DateTime _expiryTime = DateTime.MinValue;
	private readonly SemaphoreSlim _semaphore = new SemaphoreSlim(1, 1);
	private readonly TimeSpan _bufferTime = TimeSpan.FromSeconds(60); // 提前60秒刷新

	public async Task<TokenData> GetTokenAsync()
	{
		if (IsTokenValid())
			return _accessToken;

		await _semaphore.WaitAsync();

		try
		{
			// 双重检查：可能其他线程已经刷新了
			if (IsTokenValid())
				return _accessToken;

			// 带重试的刷新（最多2次）
			await RefreshTokenWithRetryAsync(2);
			return _accessToken;
		}
		finally
		{
			_semaphore.Release();
		}

	}

	private bool IsTokenValid()
	{
		return _accessToken != null &&
			   DateTime.UtcNow < _expiryTime;
	}

	private async Task RefreshTokenWithRetryAsync(int maxRetries)
	{
		Exception lastException = null;

		for (int i = 0; i < maxRetries; i++)
		{
			try
			{
				await RefreshTokenAsync();
				return;
			}
			catch (Exception ex)
			{
				lastException = ex;
				Console.WriteLine($"[TokenManager] Refresh failed, attempt {i + 1}/{maxRetries}: {ex.Message}");

				if (i < maxRetries - 1)
				{
					var delay = TimeSpan.FromSeconds(Math.Pow(2, i));
					await Task.Delay(delay);
				}
			}
		}

		throw new Exception($"Failed to refresh token after {maxRetries} attempts", lastException);
	}

	private async Task RefreshTokenAsync()
	{
		var tokenData = await GetTokenHttp();

		if (tokenData == null || string.IsNullOrEmpty(tokenData.ACCESS_TOKEN))
		{
			throw new Exception("Failed to get access token from third party");
		}

		_accessToken = tokenData;

		// 计算过期时间：当前时间 + 有效期 - 缓冲时间
		// 注意：接口返回的 EXPIRE_IN 单位是秒
		_expiryTime = DateTime.UtcNow.AddSeconds(tokenData.EXPIRE_IN).Subtract(_bufferTime);

		
	}


	private async Task<string> GetTokenHttp()
	{
		var header = new Dictionary<string, string>
		{
			{"headerKey", "headerValue"}
		}
		var result = await _httpHelper.HttpPostAsync("url", "jsonBody", null, header);
		var resultObj = JsonConvert.DeserializeObject<dynamic>(result);
		return resultObj.tokenStr;
	}
}


```
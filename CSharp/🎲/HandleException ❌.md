***

## Middleware

```c#
app.UseMiddleware<ExceptionHandlingMiddleware>();

//==================================================


public class ExceptionHandlingMiddleware
{
	private readonly RequestDelegate _next;

    public ExceptionHandlingMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            // 调用下一个中间件
            await _next(context);
        }
        catch (Exception ex)
        {
            // 处理异常
            await HandleExceptionAsync(context, ex);
        }
    }
    
	private static Task HandleExceptionAsync(HttpContext context, Exception exception)
	{
	    context.Response.ContentType = "application/json";
	
	    var statusCode = HttpStatusCode.InternalServerError; // 默认500错误
	
	    if (exception is ArgumentNullException)
	    {
	        statusCode = HttpStatusCode.BadRequest; // 400错误
	    }
	    else if (exception is UnauthorizedAccessException)
	    {
	        statusCode = HttpStatusCode.Unauthorized; // 401错误
	    }
	
	    context.Response.StatusCode = (int)statusCode;
	
	    var response = new
	    {
	        error = new
	        {
	            message = exception.Message,
	            details = exception.StackTrace
	        }
	    };
	
	    return context.Response.WriteAsJsonAsync(response);
	}
}
```


## **Filter**
 (仅适用于 MVC 或 Web API 的请求)    [[Filter]]

```c#
public class CustomExceptionFilter : IExceptionFilter
{
    public void OnException(ExceptionContext context)
    {
        // 处理异常
        var exception = context.Exception;
        var response = new
        {
            error = new
            {
                message = "An error occurred while processing your request.",
                details = exception.Message
            }
        };

        // 设置返回结果
        context.Result = new JsonResult(response)
        {
            StatusCode = (int)HttpStatusCode.InternalServerError
        };

        // 标记异常已处理
        context.ExceptionHandled = true;
    }
}
```

```c#
services.AddControllers(options =>
        {
            options.Filters.Add<CustomExceptionFilter>(); // 全局注册
        });
```

***
## **1、Authorization Filters**
```c#
public class CustomAuthorizeFilter : IAuthorizationFilter
{
    public void OnAuthorization(AuthorizationFilterContext context)
    {
        if (!context.HttpContext.User.Identity.IsAuthenticated)
        {
            context.Result = new UnauthorizedResult();
        }
    }
}

//==================================================================

[TypeFilter(typeof(CustomAuthorizeFilter))]
public class SecureController : ControllerBase
{
    [HttpGet]
    public IActionResult Get()
    {
        return Ok("You are authorized!");
    }
}

```


## 2、**Action Filters**
```c#
public class LogActionFilter : IActionFilter
{
    public void OnActionExecuting(ActionExecutingContext context)
    {
        // Action 执行之前
        Console.WriteLine($"Action {context.ActionDescriptor.DisplayName} is executing.");
    }

    public void OnActionExecuted(ActionExecutedContext context)
    {
        // Action 执行之后
        Console.WriteLine($"Action {context.ActionDescriptor.DisplayName} has executed.");
    }
}

//=================================================

[TypeFilter(typeof(LogActionFilter))]
public class LogController : ControllerBase
{
    [HttpGet]
    public IActionResult Get()
    {
        return Ok("Action executed.");
    }
}
```


## **3、Result Filters**
```c#
public class AddHeaderResultFilter : IResultFilter
{
    public void OnResultExecuting(ResultExecutingContext context)
    {
        // 结果执行之前
        context.HttpContext.Response.Headers.Add("X-Custom-Header", "Filter-Added");
    }

    public void OnResultExecuted(ResultExecutedContext context)
    {
        // 结果执行之后
    }
}

//==============================================

[TypeFilter(typeof(AddHeaderResultFilter))]
public class HeaderController : ControllerBase
{
    [HttpGet]
    public IActionResult Get()
    {
        return Ok("This response has a custom header.");
    }
}
```

## **4、Model Validation**
```c#
public class ValidateModelFilter : IActionFilter
{
    public void OnActionExecuting(ActionExecutingContext context)
    {
        if (!context.ModelState.IsValid)
        {
            context.Result = new BadRequestObjectResult(context.ModelState);
        }
    }

    public void OnActionExecuted(ActionExecutedContext context)
    {
        // 可以在这里执行其他逻辑
    }
}

//======================================================

[TypeFilter(typeof(ValidateModelFilter))]
public class ValidationController : ControllerBase
{
    [HttpPost]
    public IActionResult Post([FromBody] MyModel model)
    {
        return Ok("Model is valid.");
    }
}

```


## 5、HandleException

[[HandleException ❌]]
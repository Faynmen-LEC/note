
***
```c#
//先在配置文件 appsetting.json 添加一个Key
///允许跨域地址，逗号隔开
"CorsUrls": "http://localhost:8080/,http://127.0.0.1:8080/,http://localhost:8080/0/blogcreate,https://localhost:8080/"


//然后在 Program.cs 里,以前是Startup.cs注入服务
builder.Services.AddCors(options =>
{
    options.AddPolicy
        (name: "myCors",
         builde =>
         {
            builde.WithOrigins(
	            builder.Configuration.GetValue<string>("corsUrls").Split(","))
                    .AllowAnyOrigin()
                    .AllowAnyHeader()
                    .AllowAnyMethod();
            }
        );
});


//中间件也要写上
app.UseCors("myCors");

```
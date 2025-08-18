
***
[github](https://github.com/waf/CSharpRepl)

`dotnet tool install -g csharprepl`

>“ ctrl+enter ” 输出详细结果


``` csharp

//安装nuget
#r "nuget:<package name>"

//引用dll
#r "path/to/assembly.dll"

```

```csharp

// 加载指定目录下的 DLL 文件 
var assemblyPath = @"C:\path\to\your\assembly.dll"; 
// 替换为实际路径 
var assembly = Assembly.LoadFrom(assemblyPath); 
// 获取特定类的所有方法 
var typeName = "YourNamespace.YourClassName"; 
// 替换为实际的类名 
var type = assembly.GetType(typeName); 
if (type != null) 
{ 
	// 获取类的所有公共方法 
	var methods = type.GetMethods(BindingFlags.Public | BindingFlags.Instance | BindingFlags.Static); 
	Console.WriteLine($"Methods in {typeName}:"); 
	foreach (var method in methods) 
	{ 
		Console.WriteLine($"- {method.Name} ({string.Join(", ", method.GetParameters().Select(p => $"{p.ParameterType.Name} {p.Name}"))})"); 
	} 
} 
else 
{ 
	Console.WriteLine($"Type {typeName} not found in assembly"); 
}

```
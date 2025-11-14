
***
```txt
JToken (基类) 
├── JContainer (抽象类) 
│ ├── JObject (JSON 对象 {}) 
│ └── JArray (JSON 数组 []) 
├── JProperty (属性) 
└── JValue (具体值)
```


```csharp
using System;
using System.Collections.Generic;
using System.Linq;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace JsonExample
{
    class Program
    {
        static void Main(string[] args)
        {
            // 1. 创建各种类型的对象
            JValue jValue = new JValue("Hello World");
            JProperty jProperty = new JProperty("name", "John Doe");
            JArray jArray = new JArray(
                new JObject(new JProperty("id", 1), new JProperty("name", "Apple")),
                new JObject(new JProperty("id", 2), new JProperty("name", "Banana"))
            );

            JObject jObject = new JObject(
                new JProperty("name", "John Doe"),
                new JProperty("age", 30),
                new JProperty("isEmployed", true),
                new JProperty("skills", new JArray("C#", "JavaScript", "Python")),
                new JProperty("address", new JObject(
                    new JProperty("street", "123 Main St"),
                    new JProperty("city", "New York")
                ))
            );
            
            // 2. JSON 字符串与对象之间的序列化和反序列化
            // JObject 序列化为 JSON 字符串
            string jsonString = jObject.ToString(Formatting.Indented);
  
            // 从 JSON 字符串反序列化为 JObject
            string sampleJson = @"
            {
                ""name"": ""Jane Smith"",
                ""age"": 25,
                ""hobbies"": [""reading"", ""swimming""],
                ""contact"": {
                    ""email"": ""jane@example.com"",
                    ""phone"": ""123-456-7890""
                }
            }";

  

            JObject parsedObject = JObject.Parse(sampleJson);
            Console.WriteLine($"姓名: {parsedObject["name"]}");
            Console.WriteLine($"年龄: {parsedObject["age"]}");
            Console.WriteLine($"邮箱: {parsedObject["contact"]["email"]}\n");

  
            // 3. 各种访问和转换方法
  
            // 使用索引器访问属性
            JToken nameToken = parsedObject["name"];
            string name = (string)parsedObject["name"];

            // 使用 Property 方法访问属性
            JProperty nameProperty = parsedObject.Property("name");
            Console.WriteLine($"  属性名: {nameProperty.Name}");
            Console.WriteLine($"  属性值: {nameProperty.Value}");
            Console.WriteLine($"  值类型: {nameProperty.Value.Type}\n");

            // 访问数组
            JToken hobbiesToken = parsedObject["hobbies"];
            JArray hobbiesArray = (JArray)hobbiesToken;
            Console.WriteLine($"  数组长度: {hobbiesArray.Count}");
            foreach (JToken hobby in hobbiesArray)
            {
                Console.WriteLine($"    爱好: {hobby}");
            }
  
            // 遍历 JObject 的所有属性
            foreach (JProperty property in parsedObject.Properties())
            {
                Console.WriteLine($"  {property.Name}: {property.Value} (类型: {property.Value.Type})");
            }
  

            // 4. 类型转换示例
            
            // 使用 Value<T> 方法进行类型安全转换
            int age = parsedObject["age"].Value<int>();
            bool hasEmail = parsedObject["contact"]?["email"] != null;
            Console.WriteLine($"年龄 (int): {age}");
            Console.WriteLine($"是否有邮箱: {hasEmail}");
  
            // 安全转换，避免异常
            string email = parsedObject["contact"]?["email"]?.ToString() ?? "未提供";
            Console.WriteLine($"邮箱: {email}\n");

  
            // 5. 创建和修改 JSON 对象

            // 添加新属性
            jObject.Add("createdAt", DateTime.Now);
            jObject["age"] = 31; // 修改现有属性
            // 添加新的复杂对象
            JObject newSkill = new JObject(
                new JProperty("name", "SQL"),
                new JProperty("level", "Advanced")
            );
            JArray skills = (JArray)jObject["skills"];
            skills.Add("SQL");


            // 6. LINQ 查询示例
            
            // 查询数组中的特定项
            var advancedSkills = skills.Where(s => s.ToString().Length > 3);
            foreach (var skill in advancedSkills)
            {
                Console.WriteLine($"  {skill}");
            }

  
  
            // 7. JToken 的通用性

            // JToken 可以引用任何 JSON 类型
            JToken token1 = new JValue(42);
            JToken token2 = new JArray(1, 2, 3);
            JToken token3 = new JObject(new JProperty("key", "value"));
            Console.WriteLine($"JValue as JToken: {token1} (类型: {token1.Type})");
            Console.WriteLine($"JArray as JToken: {token2} (类型: {token2.Type})");
            Console.WriteLine($"JObject as JToken: {token3} (类型: {token3.Type})");

  
  
            // 8. 从 .NET 对象转换

            var person = new Person
            {
                Name = "Tom",
                Age = 28,
                Skills = new List<string> { "C#", "Java", "Python" }
            };

            // 使用 FromObject 转换为 JObject
            JObject personObject = JObject.FromObject(person);
            Console.WriteLine(personObject.ToString(Formatting.Indented));

  
            // 9. 转换回 .NET 对象
            
            Person deserializedPerson = personObject.ToObject<Person>();
            Console.WriteLine($"转换回的 Person 对象 - 姓名: {deserializedPerson.Name}, 年龄: {deserializedPerson.Age}");
        }
    }

  
    public class Person
    {
        public string Name { get; set; }
        public int Age { get; set; }
        public List<string> Skills { get; set; }
    }
}
```
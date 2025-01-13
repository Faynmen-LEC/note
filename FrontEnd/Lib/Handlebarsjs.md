***
```html
<!DOCTYPE html>
<html>
  <head>
    <title>Handlebars.js 示例</title>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/handlebars/dist/handlebars.min.js">
    </script> 
  </head>
  <body>
    <div id="output"></div>

    <script id="template" type="text/x-handlebars-template">
      <table>
        <thead>
          <tr>
            <th>name</th>
            <th>number</th>
            <th>team</th>
          </tr>
        </thead>
        <tbody>
          {{#each items}}
            <tr>
              <td>{{name}}</td>
              <td>{{number}}</td>
              <td>{{team}}</td>
            </tr>
          {{/each}}
        </tbody>
      </table>
    </script>

    <script>
      // 获取模板
      //var templateSource = document.getElementById("template").innerHTML;
      var templateSource = document.querySelector("#template").innerHTML;

      // 编译模板
      var template = Handlebars.compile(templateSource);

      // 定义要插入的数据
      var data = {
        items: [
          { name: "leclerc", number: 16, team: "Ferrari" },
          { name: "verstappen", number: 33, team: "Red bull" },
        ],
      };

      // 将数据与模板结合
      var html = template(data);

      // 将生成的 HTML 插入到页面中
      document.getElementById("output").innerHTML = html;
    </script>
  </body>
</html>

```
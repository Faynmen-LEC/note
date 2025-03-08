
***
```js
let controller;
button.click=async()=>{
  controller && controller.abort();//取消上一次请求
  controller = new AbortController();
  const list = await fetch(
    'http://localhost:3000/api/get',
    {
      signal:controller.signal,
    }
  ).then((resp)=>resp.json());
  //handel list result....
}
```
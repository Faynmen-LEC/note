***
当loading元素从底部出现的时候开始load more：
```js
const ob = new IntersecionObserver(
  () => {
    funcLoadMore();
  },
  {
    //root :null//默认视窗，可不填
    threshold: 0, //0~1,0是元素顶部出现的时候，1是整个元素出现
  }
);

const dom = document.querySelector(".loading");
ob.observe(dom);
```
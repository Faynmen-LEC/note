***
```jsx
gsap.to(
  ".box", //多个对象用数组 [".box1",".box2"]
  {
    duration: 2, //持续时间
    x: 200, //向x轴移动200
    fill: "bule", //变成蓝色
    rotation: 360, //旋转360°
    delay: 2, //延迟2s开始
    repeat: 2, //重复2次【-1:无限循环】
    repeatDelay: 1, //多次动作间隔时间
    yoyo: true, //完成一次后倒放一次
    stagger: 0.5, //if多个对象，相隔0.5s开始一个
    ease: "power1.out", //运动速度曲线

    onUpdate: () => {
      console.log();
    }, //按帧触发
    onComplete: () => {},
    onStart: () => {},
    onRepeat: () => {},
    onReverseComplete: () => {},
  }
);

//按时间线运行
let tl = gsap.timeline({
  yoyo: true,
  defaults: {
    //添加到tl子项的默认属性
    duration: 2,
  },
});
tl.to(".box1", { x: 100 }, 1); //延迟1s开始
tl.to(".box2", { x: 100 }, "<"); //和上一个以前开始
tl.to(".box3", { x: 100 }, ">1"); //跟上一个延时1s，等效参数【'+=1'】

//控制
let tween = gsap.to(".box", { x: 100 });
tween.pause(); //暂停
tween.resume(); //继续
tween.restart();
```
***
[chart.js]([https://www.chartjs.org/docs/latest/](https://www.chartjs.org/docs/latest/))

```html
<div>
	 <canvas id="myChart"></canvas>
</div>
<script>
   const ctx = document.getElementById('myChart');

   new Chart(ctx, {
       data: {
           labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
           datasets: [
           {
               label: 'Votes',
               data: [17, 18, 9, 14, 15, 16],
               borderWidth: 2,
               type: 'bar',    
               stack:'2',                          //分组
               backgroundColor:'blue',
               borderColor:'blue',
               order:3                             //层级
           },
           {
               label: 'Votes',
               data: [9, 8, 9, 4, 7, 6],
               borderWidth: 2,
               type: 'line',stack:'23',
               backgroundColor:'red',
               borderColor:'red',
               order:'1'
           }]
          },
          options: {
              barPercentage:0.5,                      //百分比宽度
              scales: {
                  x: {
                      stacked: true,
                  },
                  y: {
                      stacked: true,
                      beginAtZero: false,
                      ticks:{
                        callback:
                      }
                  },
              },
              plugins:{							//图例
                legend:{
                  position:'bottom',
                },
                title:{
                  text:'',
                  position:'top',
                }
              }
          }
      });
  </script>
```

# Bar

```js
datasets: [
  {
    borderSkipped: ture,		//隐藏边框线
    borderRadius:1,					//圆角
  }
],
options:{
  indexAxis: 'y',						//改成水平
}
```

# Line

```js
datasets: [
  {
    pointRadius: 1,					//点的大小
    pointHoverRadius: 5,		//鼠标悬浮时点的大小
    stepped: true,					//阶梯状
    fill: true,							//填充区域颜色
    borderDash: [5, 5],			//虚线 [实线长度，空白长度] 
    spanGaps: true,					//缺数据时补线
    segment: {
        //缺数据的颜色改为#c5c5c5，斜率向下的颜色改为c04b4b
        borderColor: ctx => skipped(ctx, '#c5c5c5') || down(ctx, '#c04b4b'),
        borderDash: ctx => skipped(ctx, [6, 6]),		//缺数据的改为虚线
    },
  }
]

```

# y轴

```js
option:{
  scales:{
    y:{
      tick:{
        callback: function (val, index) {
            return parseFloat(val) * 100 + '%';
        }
    }
  }
}
```

***
## 1、
给你两个鸡蛋, 有个100层楼, 你可以把鸡蛋从任意一层楼扔下, 鸡蛋可能破, 也可能不破, 如果不破的话, 你可以继续用这个鸡蛋扔. 你需要用这两个鸡蛋来试出鸡蛋会破的最小楼层高度. 这两个鸡蛋一模一样. 问你采用什么策略可以使最坏情况下的尝试次数最少?

[LeetCode](https://leetcode.cn/problems/super-egg-drop/description/?utm_source=LCUS&utm_medium=ip_redirect&utm_campaign=transfer2china)
```c#
private int f(int a, int b) 
	=> (a == 1 || b == 1) ? a : (f(a - 1, b - 1) + 1 + f(a - 1, b));
//k=>鸡蛋数， n=>层数
public int SuperEggDrop(int K, int N)
{
	int num = 1;
	while (f(num++, K) < N)
		{Console.WriteLine($"{num}:{f(num,K)}"); }
	return num - 1;
}
```

![[result-1.jpg]]
2次可以验证到3楼
3次可以验证到6楼

4：10
反向思路：从4楼开始扔，最坏情况：碎了，需从1楼开始验证到3楼（3次），共4次；若没碎，变成7楼的所需次数（3次），共4次；


---

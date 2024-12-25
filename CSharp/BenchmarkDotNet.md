
>build模式要求 “Release”
>测试的class和function和字段都需要用public (内部调用反射实现)

```
using BenchmarkDotNet.Attributes;
using BenchmarkDotNet.Running;
using MoreLinq;

BenchmarkRunner.Run<SimpleTester>();


//[SimpleJob(RuntimeMoniker.Net60]//分别用不同运行时
//[SimpleJob(RuntimeMoniker.Net70]
[MemoryDiagnoser(false)] //内存开销
public class SimpleTester
{
		private List<int> testList;
		
		[GlobalSetup]
		public void Setup()
		{
				testList=Enumerable.Range(1,100).Shuffle(new Random(1334)).ToList();
		}
		
		[Benchmark(Baseline=true)] //基准线
		public List<int> ListSort()
		{
				var lst=new List<int>(testList);
				lst.Sort();
				return lst;
		}
		
		[Benchmark]
		//[Argumnets(a,b)] //传参a,b
		//[Argumnets(c,d)] //传参c,d再测一次
		public List<int> LinqOrderBy()
		{
				return testList.OrderBy(x=>x).ToList();
		}
		
		[Benchmark]
		public List<int> LinqOrder()
		{
				return testList.Order().ToList();
		}
}
```
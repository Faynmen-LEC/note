
***
 foreach中有task
```c#
static void Main(string[] args)
{
    Console.WriteLine(DateTime.Now);

    List<int> list1 = new List<int>() { 1, 2, 3, 4, 5 };
    List<int> list = new List<int>();
    List<Task> tasks = new List<Task>();
    int index = 0;
    foreach (var i in list1)
    {
        tasks.Add(new Task(() =>
        {
            Thread.Sleep(3000);
            List<int> l = new List<int>() { i, i * 10, i * 100 };
            lock ((list as ICollection).SyncRoot)
            {
                list.AddRange(l);
            }
        }));
        tasks[index].Start();
        index++;
    }
    Task.WaitAll(tasks.ToArray());
    foreach (var l in list)
    {
        Console.WriteLine(l);
    }

    Console.WriteLine(DateTime.Now);
    Console.ReadKey();
}
```

task lambda
```c#
var urls=new string[]{
    "https://www.example.com/pic1.jpg",
    "https://www.example.com/pic2.jpg",
    "https://www.example.com/pic3.jpg",
};
async Task DownloadAsync(string url,string filename){
    await Task.Delay(1000);
    Console.WriteLine($"{filename} downloaded");
}

//常规方法
var tasks=new List<Task>();
foreach(var url in urls){
    tasks.Add(DownloadAsync(url,url));
}

//lambda
var tasks=urls.Select(url=>DownloadAsync(url,url));

//
await Task WhenAll(tasks);
Console.WriteLine("finished");
```
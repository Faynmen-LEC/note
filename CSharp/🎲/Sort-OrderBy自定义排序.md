
***

```c#
public class Employee
{
    public string Name { get; set; }
    public string Department { get; set; }
}
class EmployeeComparer : IComparer<Employee>
{
    private static readonly List<string> DepartmentOrder = new List<string>
    {
        "行政", "财务", "人力资源", "市场", "销售", "运营", "研发"
    };

    public int Compare(Employee? x, Employee? y)
    {
        if (x is null || y is null)
            throw new ArgumentNullException();

        int xIndex = DepartmentOrder.IndexOf(x.Department);
        int yIndex = DepartmentOrder.IndexOf(y.Department);

        if (xIndex == -1) xIndex = int.MaxValue;
        if (yIndex == -1) yIndex = int.MaxValue;

        int deptComparison = xIndex.CompareTo(yIndex);
        if (deptComparison != 0)
            return deptComparison;

        return string.Compare(x.Name, y.Name, StringComparison.Ordinal);
    }
}

List<Employee> employees = await GetEmployeesAsync();
var comparer = new EmployeeComparer();
employees.Sort(comparer);

// 或者使用 LINQ
var sortedEmployees = employees
    .OrderBy(e => e, comparer)
    .ThenBy(e => e.Name)
    .ToList();


```


泛型用法：
```c#
sealed class CustomComparer<T> : IComparer<T>
{
    private readonly Dictionary<T, int> _customOrder;

    public CustomComparer(params T[] customOrder)
    {
        _customOrder = customOrder.Index().ToDictionary(x => x.Item, x => x.Index);
    }

    public int Compare(T? x, T? y)
    {
        if (x == null && y == null) return 0;
        if (x == null) return -1;
        if (y == null) return 1;

        var i = _customOrder[x];
        var j = _customOrder[y];
        return i.CompareTo(j);
    }
}
var departments = new[] { "行政", "财务", "人力资源", "市场", "销售", "运营", "研发" };
var departmentComparer = new CustomComparer<string>(departments);
var sortedEmployees = employees
    .OrderBy(e => e.Department, departmentComparer)
    .ThenBy(e => e.Name)
    .ToList();

```

原理：
`IComparer<T>` 接口定义了一个方法 `Compare`，它接受两个参数，并返回一个整数值。这个整数值的含义就是 `CompareTo` 方法的返回值：

- -1：表示第一个参数小于第二个参数
- 0：表示两个参数相等
- 1：表示第一个参数大于第二个参数

***
## **1、Connection对象---连接数据库**

```csharp
SqlConnection connection = new SqlConnection("sql连接数据库字符串");//SqlConnection只针对sql server数据库
connection.Open();//打开连接
connection.Close();//关闭连接
```

## **2、Command对象---执行sql语句、事务、存储过程**

```csharp
string sqlString="select * from Member";//sql语句
SqlCommand command= new SqlCommand (sqlString,connection);//connection指的是Connection对象
int rows = command.ExecuteNonQuery();//返回执行sql语句所影响的数据的行数
object obj = command.ExecuteScalar();//返回第一行第一列的值
```

**ExecuteNonQuery() 返回受影响行数:**

```csharp
using (SqlConnection conn = new SqlConnection(sqlStr))
{
    //打开数据库
    conn.Open();
    //sql语句
    string sql = "INSERT INTO Car([Title] ,[Speed] ,[Info]) VALUES('奇瑞' ,190,'国产轿车')";
    //创建命令对象 
    SqlCommand cmd = new SqlCommand(sql,conn);
    //接受返回结果
    int rows = cmd.ExecuteNonQuery();
    if(rows > 0)  MessageBox.Show("添加成功");
}
```

**防止sql注入:**

```csharp
string sql = "INSERT INTO Car([Title] ,[Speed] ,[Info])VALUES(@Title,@Speed,@Info)";
//创建命令对象 
SqlCommand cmd = new SqlCommand(sql,conn);
//指定参数
cmd.Parameters.Add(new SqlParameter("@Title", txtTitle.Text));
cmd.Parameters.Add(new SqlParameter("@Speed", txtSpeed.Text));
cmd.Parameters.Add(new SqlParameter("@Info",txtInfo.Text));
```

**SqlDataReader() 返回数据集合:**

```csharp
private void getCarDate()
{
    List<Car> cars = new List<Car>();

    using (SqlConnection con = new SqlConnection(sqlStr))
    {
        //打开数据库连接
        con.Open();
        string sql = "select * from Car";
        SqlCommand com = new SqlCommand(sql, con); 
        //返回结果集
        SqlDataReader reader = com.ExecuteReader();
		
        //循环遍历
        while (reader.Read())
        {
            //v, reader["title"], reader["speed"]), reader["info"])
            Car car = new Car();
            car.Id = Convert.ToInt32(reader["id"]);
            car.Title = reader["id"].ToString();
            car.Speed = reader["speed"].ToString();
            car.Info = reader["info"].ToString();
          
            cars.Add(car);
        }
        //数据展示到控件上
        dgvCarDate.DataSource = cars;
        reader.Close();
		reader.Dispose();
    }
}
```

## **3、DataAdapter对象---数据适配器，填充数据到DataSet**

```csharp
DataSet ds=new DataSet();
SqlDataAdapter sqlDataAdapter=new SqlDataAdapter(command);
sqlDataAdapter.Fill(ds);//将数据填充到DataSet
```

## **4、DataSet对象---ADO.NET的核心**

```csharp
/// <summary>
/// 执行查询语句，返回DataSet
/// </summary>
/// <param name="SQLString">查询语句</param>
/// <returns>DataSet</returns>
public static DataSet Query(string SQLString)
{
    using (SqlConnection connection = new SqlConnection(connectionString))
    {
        DataSet ds = new DataSet();
        try
        {
            connection.Open();
            SqlDataAdapter command = new SqlDataAdapter(SQLString, connection);
            command.Fill(ds);
        }
        catch (System.Data.SqlClient.SqlException ex)
        {
            throw new Exception(ex.Message);
        }
        return ds;
    }
}
```

## **5、DataReader---数据读取器，只读模式，用的比较少**

```csharp
/// <summary>
/// 执行查询语句，返回SqlDataReader ( 注意：调用该方法后，一定要对SqlDataReader进行Close )
/// </summary>
/// <param name="strSQL">查询语句</param>
/// <returns>SqlDataReader</returns>
public static SqlDataReader ExecuteReader(string strSQL)
{
    SqlConnection connection = new SqlConnection(connectionString);
    SqlCommand cmd = new SqlCommand(strSQL, connection);
    try
    {
        connection.Open();
        SqlDataReader myReader = cmd.ExecuteReader(CommandBehavior.CloseConnection);
        return myReader;
     }
     catch (System.Data.SqlClient.SqlException e)
     {
        throw e;
     }
}
```

## 封装连接数据库配配置字符串

1. 在App.Config 文件中添加一个节点，添加配置信息

`<connectionStrings>`

`<addname="conStr"connectionString="Data Source=.;Initial Catalog=MyCar;User ID=sa;Password=1234"/>`

`</connectionStrings>`

1. 添加 using System.Configuration; 空间
2. 读取配置文件中的字符串

`string sqlStr = ConfigurationManager.ConnectionStrings["conStr"].ConnectionString;`
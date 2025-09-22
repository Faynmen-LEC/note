
***
```powershell

#获取notepad进程并停止
Get-Process -Name notepad
Stop-Process -Name notepad
Stop-Process -Id 1234


#测试端口连接
Test-NetConnection "127.0.0.1" -Port 1433


#获取当前目录下的dll文件名按文件名排序输出到txt
(Get-ChildItem *.dll | Sort-Object Name).Name > output.txt

```

```powershell

# 测试数据库
# 定义连接字符串
$connectionString = "Server=127.0.0.1;Database=Mom_Sys;User ID=sa;Password=123456;"
# 创建连接对象
$sqlConnection = New-Object System.Data.SqlClient.SqlConnection $connectionString
try {
    # 尝试打开连接
    $sqlConnection.Open()
    Write-Host "✅ 数据库连接成功！" -ForegroundColor Green
    # 可以进一步检查连接状态
    Write-Host "连接状态: $($sqlConnection.State)"
} catch {
    # 捕获异常并输出错误信息
    Write-Host "❌ 数据库连接失败: $($_.Exception.Message)" -ForegroundColor Red
} finally {
    # 确保连接被关闭，释放资源
    if ($sqlConnection.State -eq 'Open') {
        $sqlConnection.Close()
    }
    $sqlConnection.Dispose()
}

#执行查询
#...
	$query = "SELECT * FROM 你的表名 WHERE 条件"
	$dataAdapter = New-Object System.Data.SqlClient.SqlDataAdapter($query, $sqlConnection)
    $dataSet = New-Object System.Data.DataSet
    # 填充 DataSet
    $dataAdapter.Fill($dataSet)
    # 获取结果
    $results = $dataSet.Tables[0]
    # 输出结果
    $results | Format-Table -AutoSize
#...
```
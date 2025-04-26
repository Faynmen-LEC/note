***
# 1、Error: listen EACCES

```cmd
❌error Failed to start server 
Error: listen EACCES: permission denied 0.0.0.0:3000 
at Server.setupListenHandle [as _listen2] (node:net:1723:21) 
at listenInCluster (node:net:1788:12) 
at Server.listen (node:net:1876:7)

code: 'EACCES', 
errno: -4092, 
syscall: 'listen', 
address: '0.0.0.0', 
port: 3000
```

Administrator账号执行CMD：

查看端口占用：`netsh interface ipv4 show excludedportrange protocol=tcp`

清空占用端口：`net stop winnat`

重新开启：`net start winnat`

# 2、查看并释放指定端口

```cmd
netstat -ano | findstr :8080

>TCP  0.0.0.0:8080   0.0.0.0:0   LISTENING   1234 //表示PID为1234的占用了8080端口
```

```cmd
taskkill /PID 1234 /F
```

#### PowerShell (VSCode)

```powershell
#安装
winget install JanDeDobbeleer.OhMyPosh

#生成配置文件
new-item -type file -path $profile -force

#编辑
notepad $profile
```

配置内容：
```powershell

oh-my-posh init pwsh | Invoke-Expression

#自定义主题
oh-my-posh init pwsh --config C:\Users\Leclerc\AppData\Local\Programs\oh-my-posh\themes\blue-owl.omp.json | Invoke-Expression

```

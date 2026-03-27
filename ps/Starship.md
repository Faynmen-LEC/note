
#### PowerShell7

```powershell

winget install starship

notepad $profile

starship preset catppuccin-powerline -o ~/.config/starship.toml

```

配置内容：
```txt
Invoke-Expression (&starship init powershell)
```

主题Path：`C:\Users\你的用户名\.config\starship.toml`
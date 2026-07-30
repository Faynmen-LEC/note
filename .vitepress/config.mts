import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: "/note/",
  title: "Faynmen",
  description: "Faynmen_",
  head: [
    [
      "link",
      {
        rel: "icon",
        href: "/favicon.ico",
      },
    ],
  ],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [{ text: "Home", link: "/" }],

    sidebar: [
      {
        text: "AI",
        items: [{ text: "opencode Skill", link: "/AI/opencode/Skill" }],
        collapsed: true,
      },
      {
        text: "CSharp",
        items: [
          {
            text: "基础与特性",
            items: [
              { text: "BenchmarkDotNet", link: "/CSharp/BenchmarkDotNet" },
              { text: "CSharp REPL", link: "/CSharp/CSharprepl" },
              { text: "加密🔐", link: "/CSharp/加密🔐" },
            ],
            collapsed: true,
          },
          {
            text: "核心概念 🎲",
            items: [
              { text: "Cors", link: "/CSharp/🎲/Cors" },
              { text: "Filter", link: "/CSharp/🎲/Filter" },
              {
                text: "HandleException ❌",
                link: "/CSharp/🎲/HandleException ❌",
              },
              { text: "HttpClient", link: "/CSharp/🎲/HttpClient" },
              { text: "IDisposable", link: "/CSharp/🎲/IDisposable" },
              { text: "Newtonsoft.Json", link: "/CSharp/🎲/NewtonsoftJson" },
              {
                text: "Sort-OrderBy自定义排序",
                link: "/CSharp/🎲/Sort-OrderBy自定义排序",
              },
              { text: "Task", link: "/CSharp/🎲/Task" },
              { text: "TokenManager", link: "/CSharp/🎲/TokenManager" },
              { text: "单例", link: "/CSharp/🎲/单例" },
              { text: "反射&&特性", link: "/CSharp/🎲/反射&&特性" },
              { text: "多线程", link: "/CSharp/🎲/多线程" },
              { text: "递归树", link: "/CSharp/🎲/递归树" },
            ],
            collapsed: true,
          },
          {
            text: "数据库 📦",
            items: [
              { text: "ADO.NET", link: "/CSharp/📦database/ADO.NET" },
              { text: "EF", link: "/CSharp/📦database/EF" },
              { text: "MongoDB", link: "/CSharp/📦database/MongoDB" },
              { text: "RabbitMQ", link: "/CSharp/📦database/RabbitMQ" },
              { text: "SqlSugar", link: "/CSharp/📦database/SqlSugar" },
            ],
            collapsed: true,
          },
        ],
        collapsed: true,
      },
      {
        text: "FrontEnd",
        items: [
          {
            text: "JavaScript",
            items: [
              { text: "fetch乱序问题", link: "/FrontEnd/Js/fetch乱序问题" },
              { text: "滚动 load more", link: "/FrontEnd/Js/滚动 load more" },
            ],
            collapsed: true,
          },
          {
            text: "Libraries",
            items: [
              { text: "Chartjs", link: "/FrontEnd/Lib/Chartjs" },
              { text: "GSAP", link: "/FrontEnd/Lib/GSAP" },
              { text: "Handlebarsjs", link: "/FrontEnd/Lib/Handlebarsjs" },
            ],
            collapsed: true,
          },
          {
            text: "Error",
            items: [{ text: "Node Error", link: "/FrontEnd/error/Node Error" }],
          },
        ],
        collapsed: true,
      },
      {
        text: "PowerShell",
        items: [
          { text: "Oh My Posh", link: "/ps/Oh My Posh" },
          { text: "Starship", link: "/ps/Starship" },
          { text: "ps1", link: "/ps/ps1" },
        ],
        collapsed: true,
      },
      {
        text: "Other",
        items: [
          { text: "LeetCode", link: "/Other/LeetCode" },
          { text: "NetWork", link: "/Other/NetWork" },
        ],
        collapsed: true,
      },
    ], //,

    // socialLinks: [
    //   { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    // ]
  },
});

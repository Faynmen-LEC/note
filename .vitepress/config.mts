import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Faynmen",
  description: "Faynmen_",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Home", link: "/" },
      { text: "NetWork", link: "/Other/NetWork" },
    ],

    sidebar: [
      {
        text: "FrontEnd",
        items: [
          {
            text: "Error",
            items: [
              {
                text: "Node Error",
                link: "/FrontEnd/Error/Node Error",
              },
            ],
          },
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

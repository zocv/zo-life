import { defineConfig } from 'vitepress'

import { setAllSidebars } from './myscript/autoSidebar'


// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "zo-life",
  description: "个人生活",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'life', link: '/zo-repo/00 简述' },
      { text: 'start', link: 'https://zocv.github.io/zo-start/' },
      { text: 'notes', link: 'https://zocv.github.io/zo-notes/' }

    ],
    sidebar: setAllSidebars([
      ['/zo-repo/']
    ]),



    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})

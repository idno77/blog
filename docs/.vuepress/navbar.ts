export const zhNavbar = [
    //单层
    {
        text: '主页',
        link: '/',
        // 该元素将一直处于激活状态
        activeMatch: '/',
    },
    //两层嵌套
    {
        text: '语言',
        children:
            [
                {
                    text: '编程',
                    children:
                        [
                            { text: 'C', link: 'https://www.dotcpp.com/course/c/' },
                            { text: 'Js', link: '/js/' },
                            { text: 'Ts', link: 'https://ts.nodejs.cn' },
                            { text: 'Java', link: 'https://liaoxuefeng.com/books/java/introduction/index.html' }
                        ]
                },
                {
                    text: '标记',
                    children:
                        [
                            { text: 'HTML', link: 'https://developer.mozilla.org/zh-CN/docs/Web/HTML' },
                            { text: 'Markdown', link: 'https://markdown.com.cn/basic-syntax/' },
                            { text: 'CSS', link: 'https://developer.mozilla.org/zh-CN/docs/Web/CSS' },
                            { text: 'Sass', link: 'https://www.sass.hk/' },
                            { text: 'Tailwindcss', link: 'https://www.tailwindcss.cn/docs/installation' }
                        ]
                },
            ],
    },
    {
        text: '视频',
        children:
            [
                { text: 'AImodel', link: 'https://www.bilibili.com/video/BV1BuoqYDE4s/?spm_id_from=333.337.search-card.all.click&vd_source=dfd89b4ec8cf2c897e32e3e3342bb775' },
            ]
    },
    {
        text: '学习文档',
        children:
            [
                { text: 'Go', link: 'https://www.topgoer.com/%E5%B9%B6%E5%8F%91%E7%BC%96%E7%A8%8B/GMP%E5%8E%9F%E7%90%86%E4%B8%8E%E8%B0%83%E5%BA%A6.html' },
                { text: 'easyExcel', link: 'https://hd1611756908.github.io/2024/07/02/EasyExcel(%E7%94%9F%E6%88%90Excel%E6%8A%A5%E8%A1%A8)%E5%9F%BA%E6%9C%AC%E6%93%8D%E4%BD%9C/' },
                { text: 'sa-token', link: 'https://sa-token.cc/doc.html#/fun/not-login-scene' },
            ]
    },
    {
        text: '归档',
        link: '/article/',
    },
    // 字符串 - 页面文件路径
    '/about'
]

// 英文导航栏
export const enNavbar = [
    //单层
    {
        text: 'Home',
        link: '/en/',
        // 该元素将一直处于激活状态
        activeMatch: '/',
    },
    //两层嵌套
    {
        text: 'Language',
        children:
            [
                {
                    text: 'Program',
                    children:
                        [
                            { text: 'C', link: 'https://en.cppreference.com/w/c' },
                            { text: 'Js', link: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript' },
                            { text: 'Ts', link: 'https://www.typescriptlang.org/docs/' },
                            { text: 'Java', link: 'https://www.w3schools.com/java/' }
                        ]
                },
                {
                    text: 'Mark',
                    children:
                        [
                            { text: 'HTML', link: 'https://developer.mozilla.org/en-US/docs/Web/HTML' },
                            { text: 'Markdown', link: 'https://www.markdownguide.org/' },
                            { text: 'CSS', link: 'https://developer.mozilla.org/en-US/docs/Web/CSS' },
                            { text: 'Sass', link: 'https://sass-lang.com/documentation/' },
                            { text: 'Tailwindcss', link: 'https://tailwindcss.com/docs/installation/using-vite' }
                        ]
                },
            ],
    },
    {
        text: 'Tag',
        link: '/en/tag/',
    },
    {
        text: 'Category',
        link: '/en/category/',
    },
    {
        text: 'Archive',
        link: '/en/article/',
    },
    // 字符串 - 页面文件路径
    '/en/about'
 ]
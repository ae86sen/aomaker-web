# aomaker 官方网站

这是 aomaker 的官方网站源代码，使用 React 和 Tailwind CSS 构建。

## 项目结构

```
aomaker-web/
├── public/                  # 静态资源
│   ├── images/              # 图片资源
│   │   └── logo.svg         # aomaker logo
│   └── favicon.ico          # 网站图标
├── src/
│   ├── components/          # 通用组件
│   │   ├── Navbar.jsx       # 导航栏组件
│   │   ├── Footer.jsx       # 页脚组件
│   │   ├── FeatureCard.jsx  # 特性卡片组件
│   │   ├── CodeBlock.jsx    # 代码块组件
│   │   └── MarkdownRenderer.jsx # Markdown渲染组件
│   ├── layouts/             # 布局组件
│   │   ├── MainLayout.jsx   # 主布局
│   │   └── DocLayout.jsx    # 文档布局
│   ├── pages/               # 页面组件
│   │   ├── Home.jsx         # 首页
│   │   ├── Features.jsx     # 特性页面
│   │   ├── Documentation.jsx # 文档首页
│   │   ├── QuickStart.jsx   # 快速开始页面
│   │   ├── Blog.jsx         # 博客页面
│   │   ├── Community.jsx    # 社区页面
│   │   └── NotFound.jsx     # 404页面
│   ├── content/             # 内容文件
│   │   ├── docs/            # 文档内容（Markdown文件）
│   │   └── blog/            # 博客文章（Markdown文件）
│   ├── styles/              # 样式文件
│   │   └── globals.css      # 全局样式
│   ├── App.jsx              # 应用入口和路由设置
│   └── main.jsx             # React渲染入口
├── tailwind.config.js       # Tailwind CSS配置
├── postcss.config.js        # PostCSS配置
├── vite.config.js           # Vite配置
└── package.json             # 项目配置和依赖
```

## 技术栈

- React
- React Router
- Tailwind CSS
- Vite
- React Markdown
- Hero Icons

## 开发指南

### 环境要求

- Node.js 14.x 或更高版本
- npm 6.x 或更高版本

### 安装依赖

```bash
npm install
```

### 开发环境运行

```bash
npm run dev
```

这将启动开发服务器，通常在 http://localhost:3000 可以访问。

### 构建生产版本

```bash
npm run build
```

构建后的文件将位于 `dist/` 目录中。

### 预览生产版本

```bash
npm run preview
```

## 如何添加新的文档内容

1. 在 `src/content/docs/` 目录中添加新的 Markdown 文件
2. 根据需要在 `DocLayout.jsx` 中更新文档导航
3. 如果需要添加新的文档路由，请在 `App.jsx` 中更新路由设置

## 如何添加新的博客文章

1. 在 `src/content/blog/` 目录中添加新的 Markdown 文件
2. 更新 `Blog.jsx` 中的文章列表

## 自定义主题

你可以通过修改 `tailwind.config.js` 文件自定义网站的颜色主题和其他Tailwind CSS配置。 
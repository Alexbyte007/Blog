
一个包含 **后端 Express 三层架构** + **前端 Next.js 16 + Tailwind CSS** 的完整个人博客项目，主题围绕 **AI Infra / MLOps**，支持写作、管理、标签与归档浏览等功能。

---

## 技术栈

### 后端（端口 `3001`）

- Node.js + Express
- 三层架构：
  - `data/` 数据层（内存模拟数据）
  - `repositories/` 仓储层（数据读写）
  - `services/` 业务层
  - `controllers/` 控制器层（HTTP API）
- RESTful API：
  - `GET /api/posts`  
    - 支持查询参数：`tag`、`year`、`month`、`keyword`
  - `GET /api/posts/:id`
  - `GET /api/posts/slug/:slug`
  - `POST /api/posts`
  - `PUT /api/posts/:id`
  - `DELETE /api/posts/:id`
  - `POST /api/posts/:id/view`（浏览量 +1）
  - 评论相关（可选用）：  
    `GET /api/posts/:id/comments` / `POST /api/posts/:id/comments`

### 前端（端口 `3000`，目录 `next-blog`）

- Next.js 16（App Router）
- TypeScript
- Tailwind CSS
- `react-markdown` + `Prism.js` 代码高亮
- 响应式几何极简 UI，支持浅色/深色模式切换

---

## 功能概览

### 前台页面

- `/` 首页  
  - 个人主页式 Hero：欢迎语 + 快捷按钮（写文章 / 按标签浏览 / 查看归档）
  - 右侧「博客概览」卡片：文章数、总浏览量
  - 下方仅展示 **最近几篇文章** 的卡片列表

- `/posts/[slug]` 文章详情
  - 标题、时间、浏览次数、标签
  - Markdown 正文渲染
  - Prism 代码高亮
  - 自动生成目录（TOC）
  - 右上角 **编辑 / 删除** 按钮：
    - 编辑 → 跳转后台 `/admin/posts/[id]`
    - 删除 → 调用后端 API，成功后跳回 `/admin`

- `/write` 写文章
  - 标题 / 摘要 / 标签 / 正文（Markdown）
  - **草稿自动保存**：写到一半刷新不会丢
  - **实时 Markdown 预览**（桌面端右侧）
  - 「插入代码块」「插入图片」按钮，方便图文+代码混排
  - 提交后调用后端 `POST /api/posts`，成功跳转到新文章详情页

- `/tags` 标签云
  - 统计所有标签及文章数量
  - 点击标签 → 跳到 `/tags/[tag]`

- `/tags/[tag]` 标签详情
  - 调用 `GET /api/posts?tag=xxx`
  - 用卡片列表展示该标签下所有文章

- `/archive` 归档
  - 调用 `GET /api/posts`
  - 按「年份-月份」分组展示文章列表

- `/profile` 个人主页 / 设置
  - 存储在 `localStorage` 的个人信息：
    - 昵称
    - 个性签名
    - 头像图片地址（支持本地 static 路径或公网 URL）
    - 个人简介
  - Header 会自动读取这些信息展示（头像 + 昵称 + 签名）

### 后台管理

- `/admin` 文章管理
  - 列表：标题 / 创建时间 / 标签 / 浏览次数
  - 支持关键字搜索（标题/内容）与标签筛选
  - 每行操作：
    - 编辑：跳转 `/admin/posts/[id]`
    - 删除：调用 `DELETE /api/posts/:id`

- `/admin/posts/[id]` 编辑文章
  - 加载后端文章数据填充表单
  - 修改标题 / 摘要 / 标签 / 正文
  - 保存时调用 `PUT /api/posts/:id`，成功后返回 `/admin`

---

## 运行方式

### 1. 启动后端（Express）

```bash
cd Web应用架构
npm install        # 第一次运行需要安装依赖
npm run start      # 启动后端，监听 http://localhost:3001

# 澳大利亚零售商价格抓取与分析系统

一个基于 Next.js 的Web应用，用于抓取和分析澳大利亚本地零售商的商品价格数据。

## 功能特性

- 🔐 **密码认证** - 简单的密码保护系统
- 🕷️ **智能爬虫** - 自动抓取多个澳大利亚零售商网站
- 🤖 **AI分析** - 使用GPT API过滤和整理数据
- 📊 **价格统计** - 自动计算平均价、最高价、最低价
- 📱 **响应式设计** - 完美适配手机和桌面设备
- 💾 **数据导出** - 支持CSV和JSON格式下载

## 技术栈

- **前端框架**: Next.js 15 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **AI服务**: OpenAI GPT API
- **部署**: Vercel

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制 `.env.example` 到 `.env.local` 并填写以下信息：

```env
# 认证配置
AUTH_PASSWORD=your_password_here

# OpenAI API配置
OPENAI_API_KEY=your_openai_api_key

# JWT密钥
JWT_SECRET=your_random_secret_key
```

### 3. 运行开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000)

## 使用说明

1. **登录**: 使用在 `.env.local` 中设置的密码登录
2. **查询商品**: 在主页输入商品名称（例如："A2 Milk Full Cream 2L"）
3. **查看结果**: 系统会自动爬取数据并使用AI分析
4. **下载数据**: 可以下载CSV或JSON格式的结果文件

## 目标零售商

目前支持以下澳大利亚零售商：
- Coles
- Woolworths
- IGA

**注意**: 由于网站反爬虫机制，实际爬取可能需要调整选择器或使用更高级的爬取技术。系统包含模拟数据用于开发和测试。

## 爬虫说明

本项目的爬虫功能仅用于个人学习和研究目的。使用时请注意：

1. 遵守目标网站的服务条款
2. 不要进行频繁的请求
3. 尊重 robots.txt 规则
4. 仅用于合法用途

## 部署到Vercel

1. 将代码推送到GitHub仓库
2. 在Vercel中导入项目
3. 配置环境变量
4. 部署

```bash
npm run build
```

## 项目结构

```
price-scraper/
├── app/                    # Next.js App Router
│   ├── api/               # API路由
│   ├── dashboard/         # 主页面
│   ├── login/            # 登录页
│   └── layout.tsx        # 根布局
├── components/            # React组件
├── lib/                   # 工具函数
│   ├── auth.ts           # 认证逻辑
│   ├── scraper.ts        # 爬虫逻辑
│   └── gpt.ts            # GPT集成
├── types/                 # TypeScript类型定义
└── .env.local            # 环境变量
```

## 常见问题

### Q: 爬虫没有返回数据怎么办？
A: 系统会自动返回模拟数据用于测试。实际使用时需要根据目标网站的真实HTML结构调整选择器。

### Q: GPT API调用失败？
A: 系统包含备用分析函数，即使GPT失败也能返回基本的价格统计。

### Q: 如何修改密码？
A: 在 `.env.local` 文件中修改 `AUTH_PASSWORD` 变量。

## 开发计划

- [ ] 添加更多零售商支持
- [ ] 实现价格历史记录
- [ ] 添加价格提醒功能
- [ ] 优化爬虫性能
- [ ] 添加用户管理系统

## 许可证

MIT License

## 作者

Created with ❤️ for Australian price comparison

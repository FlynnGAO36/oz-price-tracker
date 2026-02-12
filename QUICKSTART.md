# 快速开始指南

## 🚀 5分钟快速上手

### 步骤 1: 安装依赖

```bash
cd price-scraper
npm install
```

### 步骤 2: 配置环境变量

编辑 `.env.local` 文件：

```env
# 基础配置（立即可用）
AUTH_PASSWORD=admin123
JWT_SECRET=your-random-secret-key-here

# OpenAI配置（必填）
OPENAI_API_KEY=your-openai-api-key-here
```

**最低要求**: 只需配置 `OPENAI_API_KEY` 即可开始使用！

### 步骤 3: 运行开发服务器

```bash
npm run dev
```

### 步骤 4: 访问应用

打开浏览器访问: http://localhost:3000

- **默认密码**: `admin123`
- 登录后即可开始查询商品价格

## 📝 示例查询

尝试以下商品名称：
- `A2 Milk Full Cream 2L`
- `Coca Cola 1.25L`
- `Nutella 400g`

## ⚠️ 重要说明

### 爬虫功能
- 项目包含完整的爬虫代码框架
- 由于反爬虫机制，实际爬取可能需要调整
- **默认使用模拟数据**进行测试和演示
- 真实爬取需要根据目标网站调整选择器

### OpenAI API
- 系统会使用 GPT 分析数据
- 如果 API 调用失败，会自动使用备用分析函数
- 使用 `gpt-4o-mini` 模型以降低成本

## 🛠️ 常见问题

### Q1: OpenAI API 密钥在哪里获取？

1. 访问 https://platform.openai.com/
2. 登录/注册账户
3. 进入 API Keys 页面
4. 创建新的密钥
5. 添加付费方式（需要信用卡）

### Q2: 没有 OpenAI API 密钥可以使用吗？

不推荐，但可以修改 `lib/gpt.ts` 直接使用 `fallbackAnalysis` 函数。

### Q3: 爬虫为什么返回模拟数据？

真实网站爬取需要：
1. 分析目标网站的 HTML 结构
2. 更新 `lib/scraper.ts` 中的选择器
3. 可能需要处理反爬虫机制（代理、延迟等）

当前代码提供了框架，实际选择器需要根据网站调整。

### Q4: 如何修改密码？

编辑 `.env.local` 文件中的 `AUTH_PASSWORD`

### Q5: 可以部署到哪里？

- **Vercel** (推荐 - 免费层足够)
- Netlify
- Railway
- 自己的服务器

详见 `DEPLOYMENT.md`

## 📚 项目文档

- **README.md** - 完整项目文档
- **DEPLOYMENT.md** - 详细部署指南

## 🎯 核心功能

✅ 密码登录保护  
✅ 商品价格查询  
✅ AI 智能分析（GPT）  
✅ 价格统计（平均/最高/最低）  
✅ 数据导出（CSV/JSON）  
✅ 响应式设计（手机/电脑）  
✅ 现代化 UI（Tailwind CSS）  

## 🔧 技术栈

- Next.js 15 (App Router)
- TypeScript
- React 18
- Tailwind CSS
- OpenAI GPT API
- Vercel (部署)

## 📞 需要帮助？

1. 查看控制台日志
2. 检查 `.env.local` 配置
3. 确认所有依赖已安装
4. 查看 README.md 中的常见问题

## 🚀 下一步

安装完成后运行：

```bash
npm run dev
```

然后访问 http://localhost:3000 开始使用！

---

**Happy Coding! 🎉**

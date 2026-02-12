# 部署指南

本文档提供详细的部署步骤，帮助您将项目部署到Vercel。

## 部署前准备

### 1. 准备OpenAI API密钥

1. 访问 [OpenAI Platform](https://platform.openai.com/)
2. 创建账户并添加付费方式
3. 在API Keys页面创建新的API密钥
4. 保存密钥（只会显示一次）

### 2. 生成JWT密钥

使用以下命令生成随机密钥：

```bash
# 使用Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# 或使用OpenSSL
openssl rand -hex 32
```

## 部署到Vercel

### 方法1: 通过Git部署（推荐）

1. **初始化Git仓库**

```bash
cd price-scraper
git init
git add .
git commit -m "Initial commit"
```

2. **推送到GitHub**

```bash
# 在GitHub上创建新仓库，然后：
git remote add origin https://github.com/你的用户名/price-scraper.git
git branch -M main
git push -u origin main
```

3. **在Vercel中导入**

   - 访问 [Vercel](https://vercel.com/)
   - 点击 "New Project"
   - 从GitHub导入你的仓库
   - 配置环境变量（见下文）
   - 点击 "Deploy"

### 方法2: 使用Vercel CLI

1. **安装Vercel CLI**

```bash
npm install -g vercel
```

2. **登录Vercel**

```bash
vercel login
```

3. **部署**

```bash
cd price-scraper
vercel
```

4. **配置环境变量**

```bash
vercel env add AUTH_PASSWORD
vercel env add OPENAI_API_KEY
vercel env add JWT_SECRET
```

5. **重新部署**

```bash
vercel --prod
```

## 环境变量配置

在Vercel项目的Settings > Environment Variables中添加以下变量：

| 变量名 | 描述 | 示例 |
|--------|------|------|
| `AUTH_PASSWORD` | 登录密码 | `your_secure_password` |
| `OPENAI_API_KEY` | OpenAI API密钥 | `sk-...` |
| `JWT_SECRET` | JWT签名密钥 | 32字节随机hex字符串 |

**注意**: 
- 确保 `OPENAI_API_KEY` 和 `JWT_SECRET` 保密
- `AUTH_PASSWORD` 建议使用强密码

## 部署后验证

1. **访问部署的网站**
   - Vercel会提供一个URL，如 `https://your-project.vercel.app`

2. **测试登录**
   - 使用配置的密码登录

3. **测试查询功能**
   - 输入商品名称（如 "A2 Milk Full Cream 2L"）
   - 查看是否正常返回结果

4. **测试下载功能**
   - 下载CSV和JSON文件
   - 验证数据格式正确

## 自定义域名（可选）

1. 在Vercel项目的Settings > Domains中
2. 添加你的自定义域名
3. 按照提示配置DNS记录
4. 等待DNS传播（通常几分钟到几小时）

## 性能优化建议

### 1. 启用Vercel Analytics

```bash
npm install @vercel/analytics
```

在 `app/layout.tsx` 中添加：

```tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### 2. 配置缓存

在 `next.config.ts` 中：

```typescript
const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=60, stale-while-revalidate=120',
          },
        ],
      },
    ];
  },
};
```

### 3. 优化图片

使用Next.js的Image组件自动优化图片。

## 监控和维护

### 查看日志

在Vercel Dashboard中：
- 点击你的项目
- 进入 Deployments
- 点击具体的部署
- 查看 Functions 标签页的日志

### 监控API使用

**OpenAI使用量**
- 访问 OpenAI Dashboard
- 查看Usage页面

### 错误追踪

考虑集成错误追踪服务：
- Sentry
- LogRocket
- Datadog

## 更新部署

### 通过Git

```bash
git add .
git commit -m "Update message"
git push
```

Vercel会自动检测到推送并重新部署。

### 通过CLI

```bash
vercel --prod
```

## 回滚部署

如果新部署有问题：

1. 在Vercel Dashboard中找到之前的部署
2. 点击右侧的"..."菜单
3. 选择 "Promote to Production"

## 常见问题解决

### 部署失败

1. 检查构建日志
2. 确保所有环境变量已正确配置
3. 本地运行 `npm run build` 测试

### API调用失败

1. 检查环境变量是否正确
2. 查看Function日志
3. 确认API密钥有效且有足够配额

### 性能问题

1. 启用Vercel Analytics分析
2. 优化爬虫请求频率
3. 考虑添加Redis缓存层

## 安全建议

1. **定期更新依赖**
   ```bash
   npm audit
   npm update
   ```

2. **监控异常登录尝试**
   - 可以添加登录尝试限制

3. **保护敏感信息**
   - 不要将 `.env.local` 提交到Git
   - 定期轮换API密钥

4. **启用Vercel的安全功能**
   - Deployment Protection
   - IP Whitelist（如需要）

## 成本估算

### Vercel
- Hobby Plan: 免费
- Pro Plan: $20/月（如需要更多功能）

### OpenAI
- 按使用量计费
- GPT-4o-mini: $0.15 / 1M input tokens
- 估算: 每次查询约 $0.001-0.005

## 技术支持

如有问题：
1. 查看项目README.md
2. 检查Vercel文档
3. 查看项目的GitHub Issues

---

**祝部署顺利！** 🚀

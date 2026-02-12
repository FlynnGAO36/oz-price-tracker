# Google Shopping API 设置指南

## 🎯 目标

配置Google Custom Search API以查询澳大利亚零售商的商品价格。

---

## ✅ 您已完成

- ✅ Google API Key: AIzaSyD26iZeXmdy4K-1TPUdnzrD8hHoB0XVqL0

---

## 📋 需要完成：获取Custom Search Engine ID

### 步骤 1: 访问Programmable Search Engine

访问: https://programmablesearchengine.google.com/

### 步骤 2: 创建新的搜索引擎

1. 点击 **"Add"** 或 **"新增"** 按钮

2. **设置搜索内容：**
   - 搜索内容: 选择 **"搜索整个网络"** (Search the entire web)
   - 或者如果要限定：输入 `*.com.au` 来限定澳大利亚网站

3. **命名您的搜索引擎：**
   ```
   名称: Australian Shopping Price Scraper
   ```

4. 点击 **"创建"** (Create)

### 步骤 3: 启用图片搜索和Shopping

1. 在创建后的页面，点击 **"控制面板"** (Control Panel)

2. 在左侧菜单找到 **"设置"** (Setup)

3. 向下滚动到 **"搜索设置"** (Search Settings)

4. 找到 **"图片搜索"** (Image search)
   - ✅ 启用 "图片搜索"

5. 找到 **"SafeSearch"**
   - 设置为您偏好的等级

### 步骤 4: 获取Search Engine ID (CX)

1. 在控制面板的 **"基本信息"** (Basics) 标签页

2. 找到 **"Search engine ID"** 或 **"搜索引擎ID"**
   
   显示格式类似：
   ```
   0123456789abcdefg:hijklmnop
   ```

3. **复制这个ID**

### 步骤 5: 配置到项目中

打开 `.env.local` 文件，更新：

```env
GOOGLE_CX=你复制的Search_Engine_ID
```

示例：
```env
GOOGLE_CX=0123456789abcdefg:hijklmnop
```

---

## 🧪 测试API

### 方法1: 在浏览器测试

访问以下URL（替换YOUR_API_KEY和YOUR_CX）：

```
https://www.googleapis.com/customsearch/v1?key=AIzaSyD26iZeXmdy4K-1TPUdnzrD8hHoB0XVqL0&cx=YOUR_CX&q=A2+Milk&gl=au
```

### 方法2: 使用cURL测试

```bash
curl "https://www.googleapis.com/customsearch/v1?key=AIzaSyD26iZeXmdy4K-1TPUdnzrD8hHoB0XVqL0&cx=YOUR_CX&q=A2+Milk&gl=au"
```

### 期望响应

应该看到JSON格式的搜索结果：

```json
{
  "kind": "customsearch#search",
  "items": [
    {
      "title": "A2 Milk Full Cream 2L - Coles",
      "link": "https://www.coles.com.au/...",
      "displayLink": "coles.com.au",
      "snippet": "价格和商品描述..."
    }
  ]
}
```

---

## 💰 API配额和定价

### 免费配额

- **100次查询/天** 完全免费
- 适合个人使用和测试

### 付费选项

如果需要更多：
- **$5 USD / 1000次查询**
- 在Google Cloud Console中启用计费

查看配额使用：
1. 访问: https://console.cloud.google.com/
2. 进入 **APIs & Services** > **Custom Search API**
3. 查看 **Quotas** 标签

---

## ⚠️ 常见问题

### Q1: 找不到 "Add" 按钮？

**解决：**
- 确保已登录Google账号
- 访问正确的URL: https://programmablesearchengine.google.com/
- 如果是新账号，可能需要先接受服务条款

### Q2: API返回403错误？

**可能原因：**
- API Key未启用Custom Search API
- 需要在Google Cloud Console启用API

**解决步骤：**
1. 访问: https://console.cloud.google.com/
2. 进入 **APIs & Services** > **Library**
3. 搜索 "Custom Search API"
4. 点击 **Enable** (启用)

### Q3: 返回的结果没有价格信息？

**说明：**
- Google Custom Search API主要返回搜索结果
- 不是专门的Shopping API
- 我们需要从结果中提取价格信息

**解决方案：**
我已经在代码中实现了价格提取逻辑，会从：
- 页面标题
- Snippet（摘要）
- Structured data (如果有)
中提取价格

### Q4: 想要更精确的Shopping结果？

**方案1: 使用Google Shopping搜索**
在创建CX时，设置搜索范围为：
```
www.google.com/shopping
```

**方案2: 过滤结果**
代码中已实现，只保留澳大利亚零售商

---

## 📊 支持的澳大利亚零售商

使用Google Shopping API可以获取以下零售商（不限于）：

- ✅ Coles
- ✅ Woolworths
- ✅ IGA
- ✅ Big W
- ✅ Kmart
- ✅ Target
- ✅ Chemist Warehouse
- ✅ Bunnings
- ✅ JB Hi-Fi
- ✅ Officeworks
- ✅ 更多...

---

## 🎉 完成检查清单

在启动应用前，确保：

- [ ] ✅ Google API Key已配置
- [ ] ⏳ 获得Custom Search Engine ID (CX)
- [ ] ⏳ 更新.env.local中的GOOGLE_CX
- [ ] ⏳ 测试API响应
- [ ] ⏳ 启动应用并测试

---

## 🚀 下一步

完成CX配置后：

```bash
# 1. 确保.env.local已更新
# 2. 启动开发服务器
npm run dev

# 3. 访问 http://localhost:3000
# 4. 测试商品: A2 Milk Full Cream 2L
```

---

## 📞 需要帮助？

如果遇到任何问题：

1. 检查API Key是否正确
2. 确认CX ID格式正确
3. 查看浏览器控制台和服务器日志
4. 测试API URL是否返回数据

---

**祝配置顺利！** 🎊

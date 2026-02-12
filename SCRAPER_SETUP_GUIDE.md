# 爬虫配置完整指南

## 🎯 目标

配置真实的Coles和Woolworths价格爬虫，用于商品：
1. A2 Milk Full Cream 2L
2. Tamiya panel line accent color Black

## 📋 方法一：查找零售商API（推荐 - 最稳定）

### Coles API 查找步骤

1. **打开Coles网站**
   ```
   https://www.coles.com.au
   ```

2. **打开开发者工具**
   - Windows: 按 `F12` 或 `Ctrl + Shift + I`
   - Mac: 按 `Cmd + Option + I`

3. **切换到Network标签**
   - 点击 "Network" 标签
   - 勾选 "Preserve log"
   - 过滤器选择 "XHR" 或 "Fetch"

4. **清空并搜索**
   - 点击垃圾桶图标清空请求
   - 在Coles网站搜索框输入 "A2 Milk"
   - 观察Network面板的请求

5. **找到API请求**
   查找包含以下关键词的请求：
   - `search`
   - `products`
   - `api`
   - JSON响应类型
   
   示例可能的URL格式：
   ```
   https://www.coles.com.au/api/products/search?query=a2+milk
   https://api.coles.com.au/search?q=a2+milk
   ```

6. **记录信息**
   右键点击该请求 > Copy > Copy as cURL
   
   记录：
   - ✅ 完整URL
   - ✅ 请求方法（GET/POST）
   - ✅ 必需的Headers（User-Agent、Authorization等）
   - ✅ 响应数据格式

### Woolworths API 查找步骤

重复上述步骤，访问：
```
https://www.woolworths.com.au
```

查找类似的API端点。

### API信息模板

将找到的信息填入下面模板：

```javascript
// Coles API配置
const COLES_API = {
  url: 'https://www.coles.com.au/api/...',
  method: 'GET',
  headers: {
    'User-Agent': '...',
    // 其他必需headers
  },
  queryParam: 'q' // 或 'query', 'search'等
};

// Woolworths API配置  
const WOOLWORTHS_API = {
  url: 'https://www.woolworths.com.au/api/...',
  method: 'GET',
  headers: {
    'User-Agent': '...',
  },
  queryParam: 'searchTerm'
};
```

## 📋 方法二：HTML选择器分析（备用方案）

如果找不到API，我们需要分析HTML结构。

### Coles HTML 选择器查找

1. **访问搜索结果页**
   ```
   https://www.coles.com.au/search?q=a2+milk
   ```

2. **右键检查元素**
   - 右键点击第一个商品卡片
   - 选择 "检查" 或 "Inspect"

3. **找到商品容器**
   通常是这样的结构：
   ```html
   <div class="product-tile" data-testid="product-tile">
     <h3 class="product-title">A2 Milk Full Cream 2L</h3>
     <span class="price">$5.50</span>
     <a href="/product/...">查看详情</a>
   </div>
   ```

4. **记录选择器**
   ```javascript
   const COLES_SELECTORS = {
     container: '.product-tile, [data-testid="product-tile"]',
     title: '.product-title, [data-testid="product-title"]',
     price: '.price, [data-testid="price"]',
     link: 'a[href*="/product/"]'
   };
   ```

### Woolworths HTML 选择器查找

重复上述步骤for Woolworths。

## 🧪 测试API端点

找到API后，可以在浏览器或命令行测试：

### 浏览器测试
直接在地址栏访问API URL：
```
https://api-endpoint.com/search?q=milk
```

### cURL测试
```bash
curl "https://api-endpoint.com/search?q=milk" \
  -H "User-Agent: Mozilla/5.0..."
```

### Postman测试
1. 导入cURL
2. 修改参数测试
3. 查看响应格式

## 📝 配置爬虫代码

找到API信息后，在 `.env.local` 添加：

```env
# Coles API配置（如果找到）
COLES_API_URL=https://...
COLES_API_KEY=xxx（如果需要）

# Woolworths API配置（如果找到）
WOOLWORTHS_API_URL=https://...
WOOLWORTHS_API_KEY=xxx（如果需要）
```

然后更新 `lib/scraper.ts` 中的配置。

## 🔍 实际案例参考

### 示例1：找到JSON API
```
URL: https://www.retailer.com/api/v1/search
Method: GET
Params: ?q=milk&limit=10
Response: 
{
  "products": [
    {
      "name": "A2 Milk",
      "price": 5.50,
      "url": "/product/123"
    }
  ]
}
```

### 示例2：使用GraphQL
某些网站使用GraphQL：
```
URL: https://www.retailer.com/graphql
Method: POST
Body: {
  "query": "{ search(term: \"milk\") { name price } }"
}
```

## ⚠️ 常见问题

### Q1: 找不到API请求？
**可能原因：**
- 网站使用服务端渲染
- API请求名称不明显
- 需要登录才能看到

**解决方法：**
- 清空Network，重新搜索
- 查看所有请求类型（不只是XHR）
- 查看Preview/Response看哪个有商品数据

### Q2: API需要认证？
**表现：**
- 返回401 Unauthorized
- 需要API Key或Token

**解决方法：**
- 查看Headers中的Authorization
- 可能需要cookie或session
- 考虑使用HTML解析替代

### Q3: 响应是加密的？
**表现：**
- 数据看起来乱码
- Base64编码

**解决方法：**
- 可能不适合爬取
- 使用HTML解析

## 📊 数据格式示例

### 期望的API响应格式

```json
{
  "results": [
    {
      "id": "123",
      "name": "A2 Milk Full Cream 2L",
      "price": 5.50,
      "currency": "AUD",
      "availability": "IN_STOCK",
      "url": "/product/a2-milk-123",
      "image": "https://..."
    }
  ],
  "total": 45
}
```

### 需要提取的关键信息

✅ 商品名称  
✅ 价格（数字）  
✅ 链接URL  
⭐ 货号/SKU（可选）  
⭐ 库存状态（可选）  

## 🎯 下一步

完成API/选择器查找后：

1. **创建配置文件**
   ```bash
   # 在项目根目录
   创建 scraper-config.json
   ```

2. **填入发现的信息**
   ```json
   {
     "coles": {
       "api_url": "找到的URL",
       "selectors": {...}
     },
     "woolworths": {
       "api_url": "找到的URL",
       "selectors": {...}
     }
   }
   ```

3. **通知我更新代码**
   将信息发给我，我会更新爬虫实现

## 📞 需要帮助？

如果在查找过程中遇到困难：
1. 截图Network面板
2. 复制可疑的API URL
3. 告诉我你看到了什么

我会帮您分析和实现！

---

**记住：爬虫应仅用于个人学习，请遵守网站服务条款！** ⚖️

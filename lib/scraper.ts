import axios from 'axios';
import { ScrapedProduct } from '@/types';

// Google Custom Search API配置
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY || '';
const GOOGLE_CX = process.env.GOOGLE_CX || '';
const GOOGLE_COUNTRY = process.env.GOOGLE_COUNTRY || 'au';

// API端点
const GOOGLE_SEARCH_API = 'https://www.googleapis.com/customsearch/v1';

// 缓存配置
interface CacheEntry {
  data: ScrapedProduct[];
  timestamp: number;
}

const cache = new Map<string, CacheEntry>();
const CACHE_EXPIRY = 5 * 60 * 1000; // 5分钟

// 澳大利亚主要零售商列表
const AUSTRALIAN_RETAILERS = [
  'coles.com.au',
  'woolworths.com.au',
  'iga.com.au',
  'bigw.com.au',
  'kmart.com.au',
  'target.com.au',
  'chemistwarehouse.com.au',
  'bunnings.com.au',
  'jbhifi.com.au',
  'officeworks.com.au',
  'catch.com.au',
  'ebay.com.au',
  'amazon.com.au',
];

/**
 * 检查域名是否为澳大利亚零售商
 */
function isAustralianRetailer(domain: string): boolean {
  return AUSTRALIAN_RETAILERS.some(retailer => 
    domain.toLowerCase().includes(retailer.toLowerCase())
  );
}

/**
 * 从文本中提取价格
 */
function extractPrice(text: string): number | null {
  if (!text) return null;
  
  // 清理文本
  const cleanText = text.replace(/\s+/g, ' ').trim();
  
  // 尝试多种价格格式
  const patterns = [
    /\$\s*(\d+(?:,\d{3})*(?:\.\d{2})?)/g,  // $5.50, $1,234.50
    /AUD\s*(\d+(?:,\d{3})*(?:\.\d{2})?)/gi, // AUD 5.50
    /(\d+(?:,\d{3})*(?:\.\d{2})?)\s*(?:dollars?|aud)/gi, // 5.50 dollars
    /price[:\s]+\$?(\d+(?:,\d{3})*(?:\.\d{2})?)/gi, // Price: $5.50
  ];
  
  for (const pattern of patterns) {
    const matches = [...cleanText.matchAll(pattern)];
    for (const match of matches) {
      const priceStr = match[1].replace(/,/g, '');
      const price = parseFloat(priceStr);
      if (!isNaN(price) && price > 0 && price < 100000) {
        return price;
      }
    }
  }
  
  return null;
}

/**
 * 从域名提取零售商名称
 */
function extractRetailerName(domain: string): string {
  const cleanDomain = domain.toLowerCase().replace('www.', '').replace('.com.au', '');
  
  // 特殊处理一些品牌名称
  const brandMap: Record<string, string> = {
    'coles': 'Coles',
    'woolworths': 'Woolworths',
    'iga': 'IGA',
    'bigw': 'Big W',
    'kmart': 'Kmart',
    'target': 'Target',
    'chemistwarehouse': 'Chemist Warehouse',
    'bunnings': 'Bunnings',
    'jbhifi': 'JB Hi-Fi',
    'officeworks': 'Officeworks',
    'catch': 'Catch',
    'ebay': 'eBay',
    'amazon': 'Amazon',
  };
  
  for (const [key, value] of Object.entries(brandMap)) {
    if (cleanDomain.includes(key)) {
      return value;
    }
  }
  
  // 默认首字母大写
  return cleanDomain.charAt(0).toUpperCase() + cleanDomain.slice(1);
}

/**
 * 使用Google Custom Search API搜索商品
 */
async function searchGoogle(productName: string): Promise<ScrapedProduct[]> {
  // 检查环境变量
  if (!GOOGLE_API_KEY || GOOGLE_API_KEY === 'your_google_api_key_here') {
    console.error('[Google Shopping] API Key未配置');
    throw new Error('Google API Key未配置，请在.env.local中设置GOOGLE_API_KEY');
  }
  
  if (!GOOGLE_CX || GOOGLE_CX === 'your_custom_search_engine_id_here') {
    console.error('[Google Shopping] Custom Search Engine ID未配置');
    throw new Error('Google CX未配置，请按照GOOGLE_SHOPPING_SETUP.md获取并配置GOOGLE_CX');
  }
  
  try {
    console.log(`[Google Shopping] 搜索商品: ${productName}`);
    
    // 构建API请求
    const params = new URLSearchParams({
      key: GOOGLE_API_KEY,
      cx: GOOGLE_CX,
      q: productName,
      gl: GOOGLE_COUNTRY, // 地理位置：澳大利亚
      num: '10', // 返回最多10个结果
    });
    
    const url = `${GOOGLE_SEARCH_API}?${params.toString()}`;
    console.log(`[Google Shopping] API URL: ${url.substring(0, 100)}...`);
    
    const response = await axios.get(url, {
      timeout: 15000,
      headers: {
        'Accept': 'application/json',
      },
    });
    
    const data = response.data;
    
    if (!data.items || data.items.length === 0) {
      console.log('[Google Shopping] 未找到搜索结果');
      return [];
    }
    
    console.log(`[Google Shopping] 找到 ${data.items.length} 个搜索结果`);
    
    const products: ScrapedProduct[] = [];
    
    // 处理每个搜索结果
    for (const item of data.items) {
      const domain = item.displayLink || '';
      
      // 只保留澳大利亚零售商
      if (!isAustralianRetailer(domain)) {
        continue;
      }
      
      // 提取商品信息
      const title = item.title || '';
      const snippet = item.snippet || '';
      const link = item.link || '';
      
      // 尝试从多个来源提取价格
      let price: number | null = null;
      
      // 1. 尝试从结构化数据中获取价格
      if (item.pagemap && item.pagemap.offer) {
        const offers = Array.isArray(item.pagemap.offer) ? item.pagemap.offer : [item.pagemap.offer];
        for (const offer of offers) {
          if (offer.price) {
            const priceValue = parseFloat(offer.price);
            if (!isNaN(priceValue) && priceValue > 0) {
              price = priceValue;
              break;
            }
          }
        }
      }
      
      // 2. 从标题中提取价格
      if (!price) {
        price = extractPrice(title);
      }
      
      // 3. 从snippet中提取价格
      if (!price) {
        price = extractPrice(snippet);
      }
      
      // 如果找到价格，添加到结果
      if (price) {
        const retailerName = extractRetailerName(domain);
        
        products.push({
          product_name: title,
          price: price,
          supplier: retailerName,
          url: link,
        });
        
        console.log(`[Google Shopping] ✓ ${retailerName}: $${price.toFixed(2)}`);
      }
    }
    
    console.log(`[Google Shopping] 成功提取 ${products.length} 个有价格的商品`);
    
    return products;
    
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.error('[Google Shopping] API错误:', error.response.status, error.response.data);
        
        // 处理特定错误
        if (error.response.status === 403) {
          throw new Error('Google API访问被拒绝，请检查API Key是否正确并已启用Custom Search API');
        } else if (error.response.status === 429) {
          throw new Error('API配额已用完，请稍后再试或升级配额');
        }
      } else {
        console.error('[Google Shopping] 网络错误:', error.message);
      }
    }
    throw error;
  }
}

/**
 * 检查缓存
 */
function getCachedData(key: string): ScrapedProduct[] | null {
  const cached = cache.get(key);
  if (!cached) return null;
  
  const age = Date.now() - cached.timestamp;
  if (age > CACHE_EXPIRY) {
    cache.delete(key);
    return null;
  }
  
  console.log(`[Cache] 使用缓存数据 "${key}" (${Math.round(age / 1000)}秒前)`);
  return cached.data;
}

/**
 * 设置缓存
 */
function setCachedData(key: string, data: ScrapedProduct[]): void {
  cache.set(key, { data, timestamp: Date.now() });
}

/**
 * 主爬虫函数 - 使用Google Shopping API
 */
export async function scrapeProduct(productName: string): Promise<ScrapedProduct[]> {
  const cacheKey = `google_${productName.toLowerCase().trim()}`;
  
  // 检查缓存
  const cached = getCachedData(cacheKey);
  if (cached && cached.length > 0) {
    return cached;
  }
  
  try {
    // 使用Google Shopping API搜索
    const products = await searchGoogle(productName);
    
    // 如果找到结果，缓存并返回
    if (products.length > 0) {
      setCachedData(cacheKey, products);
      return products;
    }
    
    // 如果没有找到结果，返回模拟数据（用于演示）
    console.log('[Google Shopping] 未找到价格数据，返回模拟数据');
    return getMockData(productName);
    
  } catch (error) {
    console.error('[Google Shopping] 搜索失败:', error);
    
    // 如果是配置错误，抛出异常让用户知道
    if (error instanceof Error && (
      error.message.includes('未配置') || 
      error.message.includes('API Key') ||
      error.message.includes('CX')
    )) {
      throw error;
    }
    
    // 其他错误返回模拟数据
    return getMockData(productName);
  }
}

/**
 * 模拟数据（用于演示和测试）
 */
function getMockData(productName: string): ScrapedProduct[] {
  console.log('[Mock Data] 生成模拟价格数据');
  
  return [
    {
      product_name: productName,
      price: 5.50,
      supplier: 'Coles',
      url: 'https://www.coles.com.au',
    },
    {
      product_name: productName,
      price: 5.00,
      supplier: 'Woolworths',
      url: 'https://www.woolworths.com.au',
    },
    {
      product_name: productName,
      price: 5.75,
      supplier: 'IGA',
      url: 'https://www.iga.com.au',
    },
    {
      product_name: `${productName} - 2 Pack`,
      price: 10.50,
      supplier: 'Coles',
      url: 'https://www.coles.com.au',
    },
  ];
}

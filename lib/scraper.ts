'use server';

import axios from 'axios';
import { ScrapedProduct } from '@/types';

interface CacheData {
  timestamp: number;
  data: ScrapedProduct[];
}

const CACHE_DIR = '/tmp/shopping_cache';
const CACHE_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours

// SearchAPI.io configuration
const SEARCHAPI_KEY = 'TjHQAVrhYQjG2VauLUxrWqBV';
const SEARCHAPI_BASE_URL = 'https://www.searchapi.io/api/v1/search';

// Cache functions
function getCachedData(productName: string): ScrapedProduct[] | null {
  try {
    const fs = require('fs');
    if (!fs.existsSync(CACHE_DIR)) {
      return null;
    }

    const cachePath = `${CACHE_DIR}/${encodeURIComponent(productName)}.json`;
    if (!fs.existsSync(cachePath)) {
      return null;
    }

    const cached = JSON.parse(fs.readFileSync(cachePath, 'utf-8')) as CacheData;
    const now = Date.now();

    if (now - cached.timestamp > CACHE_EXPIRY_MS) {
      fs.unlinkSync(cachePath);
      return null;
    }

    return cached.data;
  } catch (error) {
    return null;
  }
}

function setCachedData(productName: string, data: ScrapedProduct[]): void {
  try {
    const fs = require('fs');
    if (!fs.existsSync(CACHE_DIR)) {
      fs.mkdirSync(CACHE_DIR, { recursive: true });
    }

    const cachePath = `${CACHE_DIR}/${encodeURIComponent(productName)}.json`;
    const cacheData: CacheData = {
      timestamp: Date.now(),
      data,
    };

    fs.writeFileSync(cachePath, JSON.stringify(cacheData));
  } catch (error) {
    // Silently fail on cache write
  }
}

// Parse SearchAPI.io Google Shopping results
async function searchGoogleShopping(productName: string): Promise<ScrapedProduct[]> {
  try {
    console.log(`[Scraper] 🔍 Searching Google Shopping for: "${productName}"`);
    console.log(`[Scraper] API: SearchAPI.io`);

    const params = {
      engine: 'google_shopping',
      q: productName,
      api_key: SEARCHAPI_KEY,
      gl: 'au',
      hl: 'en',
    };

    const response = await axios.get(SEARCHAPI_BASE_URL, {
      params,
      timeout: 15000,
    });

    const products: ScrapedProduct[] = [];

    if (response.data?.shopping_results) {
      console.log(`[Scraper] ✓ Found ${response.data.shopping_results.length} results from API`);

      for (const item of response.data.shopping_results.slice(0, 10)) {
        try {
          const title = item.title?.trim();
          let price: number | null = null;

          // Extract price - try different fields
          if (item.price) {
            const priceStr = String(item.price).replace(/[^0-9.]/g, '');
            price = parseFloat(priceStr);
          }

          if (!price && item.offer) {
            const priceStr = String(item.offer).replace(/[^0-9.]/g, '');
            price = parseFloat(priceStr);
          }

          // Get supplier/source
          const supplier = item.source || item.seller || 'Google Shopping';

          if (title && price && price > 0) {
            products.push({
              product_name: title.substring(0, 150),
              price,
              supplier: supplier.toString().substring(0, 100),
              url: item.link || '',
            });

            console.log(
              `[Scraper]   ✓ ${title.substring(0, 60)}... - $${price.toFixed(2)} (${supplier})`
            );
          }
        } catch (e) {
          console.log(`[Scraper] ⚠️  Error parsing item: ${(e as Error).message}`);
          // Skip this item and continue
        }
      }
    } else if (response.data?.search_results) {
      // Handle generic search results format
      console.log(`[Scraper] ✓ Found ${response.data.search_results.length} search results`);

      for (const item of response.data.search_results.slice(0, 10)) {
        try {
          const title = item.title?.trim() || item.name?.trim();
          let price: number | null = null;

          if (item.price) {
            const priceStr = String(item.price).replace(/[^0-9.]/g, '');
            price = parseFloat(priceStr);
          }

          const supplier = item.source || item.domain || 'Online Store';

          if (title && price && price > 0) {
            products.push({
              product_name: title.substring(0, 150),
              price,
              supplier: supplier.toString().substring(0, 100),
              url: item.link || '',
            });

            console.log(`[Scraper]   ✓ ${title.substring(0, 60)}... - $${price.toFixed(2)}`);
          }
        } catch (e) {
          // Skip invalid items
        }
      }
    } else {
      console.log('[Scraper] ℹ️  No results in API response');
      console.log('[Scraper] Response keys:', Object.keys(response.data || {}).join(', '));
    }

    return products;
  } catch (error) {
    if (error instanceof Error) {
      console.error(`[Scraper] ❌ SearchAPI.io error: ${error.message}`);
    } else {
      console.error('[Scraper] ❌ Unknown error:', error);
    }
    return [];
  }
}

// Demo/fallback data for testing
async function getDemoProducts(productName: string): Promise<ScrapedProduct[]> {
  console.log(`[Scraper] 📦 Using demo data for testing: "${productName}"`);

  const demoData: { [key: string]: ScrapedProduct[] } = {
    'a2 milk': [
      {
        product_name: 'A2 Milk Full Cream 2L',
        price: 5.50,
        supplier: 'Woolworths Australia',
        url: 'https://www.woolworths.com.au/search?q=a2+milk',
      },
      {
        product_name: 'A2 Milk Full Cream 2L',
        price: 5.40,
        supplier: 'Coles Group Limited',
        url: 'https://www.coles.com.au/search?q=a2+milk',
      },
      {
        product_name: 'A2 Milk Full Cream 2L',
        price: 5.95,
        supplier: 'Aldi Australia',
        url: 'https://www.aldi.com.au',
      },
    ],
  };

  const key = productName.toLowerCase().replace(/[^a-z0-9]/g, ' ').trim();
  return demoData[key] || [];
}

export async function scrapeProduct(productName: string): Promise<ScrapedProduct[]> {
  // Check cache first
  const cached = getCachedData(productName);
  if (cached && cached.length > 0) {
    console.log(`[Scraper] ✅ Returning ${cached.length} cached products`);
    return cached;
  }

  console.log(`\n[Scraper] 🛍️  Starting search for: "${productName}"`);

  // Try SearchAPI.io
  let results = await searchGoogleShopping(productName);

  // If SearchAPI fails, use demo data as fallback
  if (results.length === 0) {
    console.log('[Scraper] ℹ️  API returned no results, using demo data');
    results = await getDemoProducts(productName);
  }

  // Cache and return results
  if (results.length > 0) {
    setCachedData(productName, results);
    console.log(`[Scraper] ✅ Found and cached ${results.length} products\n`);
  } else {
    console.log('[Scraper] ❌ No products found\n');
  }

  return results;
}

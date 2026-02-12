// 商品价格数据类型
export interface SupplierData {
  name: string;
  price: number;
  url?: string;
}

export interface PriceData {
  product_name: string;
  average_price: number;
  highest_price: number;
  lowest_price: number;
  suppliers: SupplierData[];
  scraped_at: string;
}

// 查询状态类型
export type QueryStatus = 'pending' | 'scraping' | 'analyzing' | 'completed' | 'failed';

export interface Query {
  id: string;
  product_name: string;
  status: QueryStatus;
  result?: PriceData;
  error_message?: string;
  created_at: string;
  updated_at: string;
}

// 爬虫原始数据类型
export interface ScrapedProduct {
  product_name: string;
  price: number | string;
  supplier: string;
  url?: string;
}

// API响应类型
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

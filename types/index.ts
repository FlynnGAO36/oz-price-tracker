// Product price data structure
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

// Query status types
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

// Raw scraper data structure
export interface ScrapedProduct {
  product_name: string;
  price: number;
  supplier: string;
  url?: string;
}

// API response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

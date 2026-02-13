import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import { scrapeProduct } from '@/lib/scraper';
import { analyzeWithGPT } from '@/lib/gpt';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Please login first' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { product_name } = body;

    if (!product_name || typeof product_name !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Please provide a valid product name' },
        { status: 400 }
      );
    }

    // Step 1: Scrape data
    console.log(`[API] Starting scrape for product: ${product_name}`);
    const scrapedData = await scrapeProduct(product_name);

    if (scrapedData.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No product data found' },
        { status: 404 }
      );
    }

    console.log(`[API] Scraped ${scrapedData.length} products`);

    // Step 2: Analyze with GPT
    console.log('[API] Starting GPT analysis...');
    const analyzedData = await analyzeWithGPT(product_name, scrapedData);

    console.log('[API] Analysis complete');

    return NextResponse.json({
      success: true,
      data: analyzedData,
    });
  } catch (error) {
    console.error('[API] Query error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Query failed, please try again'
      },
      { status: 500 }
    );
  }
}

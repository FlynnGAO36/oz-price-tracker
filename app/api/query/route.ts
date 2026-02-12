import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import { scrapeProduct } from '@/lib/scraper';
import { analyzeWithGPT } from '@/lib/gpt';

export async function POST(request: NextRequest) {
  try {
    // 检查认证
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json(
        { success: false, error: '未授权，请先登录' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { product_name } = body;

    if (!product_name || typeof product_name !== 'string') {
      return NextResponse.json(
        { success: false, error: '请提供有效的商品名称' },
        { status: 400 }
      );
    }

    // 步骤1: 爬取数据
    console.log(`开始爬取商品: ${product_name}`);
    const scrapedData = await scrapeProduct(product_name);

    if (scrapedData.length === 0) {
      return NextResponse.json(
        { success: false, error: '未找到相关商品数据' },
        { status: 404 }
      );
    }

    console.log(`爬取到 ${scrapedData.length} 条数据`);

    // 步骤2: 使用GPT分析数据
    console.log('开始GPT分析...');
    const analyzedData = await analyzeWithGPT(product_name, scrapedData);

    console.log('分析完成');

    return NextResponse.json({
      success: true,
      data: analyzedData,
    });
  } catch (error) {
    console.error('Query error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : '查询失败，请重试'
      },
      { status: 500 }
    );
  }
}

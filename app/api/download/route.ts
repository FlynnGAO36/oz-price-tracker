import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import { PriceData } from '@/types';

export async function POST(request: NextRequest) {
  try {
    // 检查认证
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json(
        { success: false, error: '未授权' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { data, format } = body as { data: PriceData; format: 'csv' | 'json' };

    if (!data || !format) {
      return NextResponse.json(
        { success: false, error: '缺少必要参数' },
        { status: 400 }
      );
    }

    if (format === 'json') {
      // 返回JSON格式
      const jsonContent = JSON.stringify(data, null, 2);
      return new NextResponse(jsonContent, {
        headers: {
          'Content-Type': 'application/json',
          'Content-Disposition': `attachment; filename="price-data-${Date.now()}.json"`,
        },
      });
    } else if (format === 'csv') {
      // 转换为CSV格式
      const csvRows = [
        ['商品名称', '零售商', '价格', '链接'].join(','),
        ...data.suppliers.map(supplier =>
          [
            `"${data.product_name}"`,
            `"${supplier.name}"`,
            supplier.price,
            `"${supplier.url || ''}"`,
          ].join(',')
        ),
        '', // 空行
        ['统计信息'].join(','),
        ['平均价格', data.average_price].join(','),
        ['最高价格', data.highest_price].join(','),
        ['最低价格', data.lowest_price].join(','),
        ['抓取时间', `"${data.scraped_at}"`].join(','),
      ];

      const csvContent = csvRows.join('\n');
      
      // 添加BOM以支持中文
      const bom = '\uFEFF';
      const csvWithBom = bom + csvContent;

      return new NextResponse(csvWithBom, {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="price-data-${Date.now()}.csv"`,
        },
      });
    }

    return NextResponse.json(
      { success: false, error: '不支持的格式' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json(
      { success: false, error: '下载失败' },
      { status: 500 }
    );
  }
}

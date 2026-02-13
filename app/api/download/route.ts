import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import { PriceData } from '@/types';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { data, format } = body as { data: PriceData; format: 'csv' | 'json' };

    if (!data || !format) {
      return NextResponse.json(
        { success: false, error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    if (format === 'json') {
      // Return JSON format
      const jsonContent = JSON.stringify(data, null, 2);
      return new NextResponse(jsonContent, {
        headers: {
          'Content-Type': 'application/json',
          'Content-Disposition': `attachment; filename="price-data-${Date.now()}.json"`,
        },
      });
    } else if (format === 'csv') {
      // Convert to CSV format
      const csvRows = [
        ['Product Name', 'Retailer', 'Price', 'Link'].join(','),,
        ...data.suppliers.map(supplier =>
          [
            `"${data.product_name}"`,
            `"${supplier.name}"`,
            supplier.price,
            `"${supplier.url || ''}"`,
          ].join(',')
        ),
        '', // Empty row
        ['Statistics'].join(','),
        ['Average Price', data.average_price].join(','),
        ['Highest Price', data.highest_price].join(','),
        ['Lowest Price', data.lowest_price].join(','),
        ['Fetched Time', `"${data.scraped_at}"`].join(','),
      ];

      const csvContent = csvRows.join('\n');
      
      // Add BOM for UTF-8 encoding support
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
      { success: false, error: 'Unsupported format' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json(
      { success: false, error: 'Download failed' },
      { status: 500 }
    );
  }
}

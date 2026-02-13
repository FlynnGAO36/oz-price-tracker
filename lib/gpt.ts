import OpenAI from 'openai';
import { ScrapedProduct, PriceData } from '@/types';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Analyze and filter scraped product data using GPT
export async function analyzeWithGPT(
  productName: string,
  scrapedData: ScrapedProduct[]
): Promise<PriceData> {
  try {
    const prompt = `You are a data analyst specializing in retail price data.

I have scraped the following product data from Australian retailers for the product: "${productName}"

Scraped Data:
${JSON.stringify(scrapedData, null, 2)}

Please analyze this data and:
1. Filter out any products that don't match "${productName}" (remove irrelevant or dissimilar products)
2. Keep only the most relevant matches
3. Calculate the average price, highest price, and lowest price
4. Format the output as JSON

Return ONLY valid JSON in this exact format (no markdown, no code blocks, just raw JSON):
{
  "product_name": "${productName}",
  "average_price": <number>,
  "highest_price": <number>,
  "lowest_price": <number>,
  "suppliers": [
    {
      "name": "<supplier name>",
      "price": <number>,
      "url": "<url or empty string>"
    }
  ],
  "scraped_at": "${new Date().toISOString()}"
}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // Using cost-effective model
      messages: [
        {
          role: 'system',
          content: 'You are a data analyst. Always respond with valid JSON only, no markdown formatting.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.3,
      max_tokens: 2000,
    });

    const responseText = completion.choices[0].message.content?.trim() || '';
    
    // Clean up potential markdown formatting
    const jsonText = responseText
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    const result: PriceData = JSON.parse(jsonText);
    return result;
  } catch (error) {
    console.error('GPT analysis error:', error);
    
    // If GPT fails, use simple local analysis as fallback
    return fallbackAnalysis(productName, scrapedData);
  }
}

// Fallback analysis function when GPT API fails
function fallbackAnalysis(productName: string, scrapedData: ScrapedProduct[]): PriceData {
  // Simple name matching filter
  const filteredData = scrapedData.filter(item => {
    const itemName = item.product_name.toLowerCase();
    const searchName = productName.toLowerCase();
    return itemName.includes(searchName) || searchName.includes(itemName);
  });

  if (filteredData.length === 0) {
    throw new Error('No matching products found');
  }

  const prices = filteredData.map(item => 
    typeof item.price === 'number' ? item.price : parseFloat(item.price as string)
  );

  const average = prices.reduce((sum, price) => sum + price, 0) / prices.length;
  const highest = Math.max(...prices);
  const lowest = Math.min(...prices);

  return {
    product_name: productName,
    average_price: parseFloat(average.toFixed(2)),
    highest_price: highest,
    lowest_price: lowest,
    suppliers: filteredData.map(item => ({
      name: item.supplier,
      price: typeof item.price === 'number' ? item.price : parseFloat(item.price as string),
      url: item.url,
    })),
    scraped_at: new Date().toISOString(),
  };
}

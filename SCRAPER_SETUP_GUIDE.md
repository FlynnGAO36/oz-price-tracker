# Web Scraper Configuration Guide

## ℹ️ Important Update

This project now uses **SearchAPI.io** for all web scraping operations. The detailed HTML parsing guide below is for reference and historical purposes.

## 🔄 Current Architecture

Instead of direct web scraping with Puppeteer, we now use:

```
User Query → SearchAPI.io API → Raw Search Results → GPT Analysis → Structured Output
```

**Why SearchAPI.io:**
- Reliable: 99%+ uptime
- Maintained: Handles anti-bot protection
- Cost-effective: Pay per use
- Simple: Just HTTP requests
- No infrastructure needed

## 🎯 Current Product Search

The system searches for products like:
1. A2 Milk Full Cream 2L
2. Coca Cola 1.25L
3. Nutella 400g

## 📋 How to Add New Retailers

If you want to add support for new Australian retailers:

### Option 1: Use SearchAPI.io (Recommended)

SearchAPI.io supports:
- Google Shopping (default)
- Google Search
- Bing
- Yahoo

Configuration:

```typescript
// In lib/scraper.ts
const searchParams = {
  engine: 'google_shopping', // or 'google', 'bing'
  q: productName,
  region: 'au',
  gl: 'au'
};
```

### Option 2: Direct API (If Available)

If a retailer provides API:

```typescript
// Example structure
const response = await fetch(`${retailerApiUrl}/search`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ query: productName })
});
```

## 🧪 Testing the Scraper

### Local Testing

```bash
# Run development server
npm run dev

# Login at http://localhost:3000
# Password: 123123

# Try searching for: A2 Milk Full Cream 2L
```

### API Endpoint Testing

```bash
# Test the query endpoint
curl -X POST http://localhost:3000/api/query \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"product_name":"A2 Milk Full Cream 2L"}'
```

## 📊 Data Flow

```
1. User submits search
   ↓
2. System checks 24-hour cache
   ↓
3. If not cached → Call SearchAPI.io
   ↓
4. Parse and structure results
   ↓
5. Send to GPT for analysis
   ↓
6. GPT filters and enriches data
   ↓
7. Return structured JSON
   ↓
8. Cache for 24 hours
   ↓
9. Display to user
```

## 🔍 Understanding SearchAPI.io Responses

### Raw Response Example

```json
{
  "shopping_results": [
    {
      "title": "A2 Milk Full Cream 2L",
      "price": "5.50",
      "product_link": "https://...",
      "source": "Coles",
      "rating": 4.5
    }
  ]
}
```

### After GPT Processing

```json
{
  "product_name": "A2 Milk Full Cream 2L",
  "average_price": 5.62,
  "lowest_price": 5.40,
  "highest_price": 5.95,
  "suppliers": [
    {
      "name": "Coles",
      "price": 5.50,
      "url": "https://..."
    }
  ]
}
```

## 🚀 Performance Tips

1. **Cache Strategy**: 24-hour cache reduces API calls by ~95%
2. **Batch Requests**: Group similar searches
3. **Rate Limiting**: SearchAPI.io handles auto-scaling
4. **Cost Control**: Monitor SearchAPI.io dashboard for usage

## ⚠️ Rate Limiting

SearchAPI.io limits:
- Free tier: Limited requests
- Pro tier: 10,000 requests/month
- Enterprise: Unlimited

Monitor usage in SearchAPI.io dashboard.

## 🔧 Troubleshooting

### No Results Returned?

1. Check SearchAPI.io API key is valid
2. Verify product name is in English
3. Check API quota not exceeded
4. System falls back to demo data

### Prices Seem Incorrect?

1. Check data manually on retailers' websites
2. Prices may vary by location/date
3. GPT filters out irrelevant results
4. Some retailers may not be included

### High API Costs?

1. Cache is working: Check if same queries are repeated
2. Reduce search frequency
3. Use demo data for testing
4. Monitor SearchAPI.io usage dashboard

## 📞 Need Help?

1. Check `README.md` for detailed info
2. Review `DEPLOYMENT.md` for setup
3. See `QUICKSTART.md` for getting started

---

**Note:** Direct HTML scraping is no longer used. All searches go through SearchAPI.io API.

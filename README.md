# Australian Price Comparison Tool

A web application that searches product prices across Australian retailers and displays comparison results with statistical analysis.

## What It Does

Users enter a product name (like "A2 Milk Full Cream 2L"), and the system:
1. Searches Google Shopping for Australian retailers
2. Uses AI to filter irrelevant results
3. Calculates average, lowest, and highest prices
4. Displays a clean comparison across different suppliers

## Why SearchAPI.io Instead of Custom Scraper

**The Problem with Direct Scraping:**
Google Shopping has aggressive anti-bot protection. When you try to scrape directly with Puppeteer or similar tools, you get blocked immediately. The site detects automated browsers, shows CAPTCHA challenges, or returns empty pages.

**The Solution:**
SearchAPI.io is a professional service that handles all the anti-bot complexity. They maintain infrastructure specifically designed to reliably access Google Shopping data. Instead of fighting Google's protection systems ourselves, we pay a small fee per search and get reliable results every time.

**Cost Trade-off:**
Running our own scraping infrastructure (proxies, CAPTCHA solvers, browser farms) costs more and breaks frequently. SearchAPI.io costs about $0.01-0.05 per search and works 99% of the time.

## What GPT Does

**Raw Data Problem:**
SearchAPI.io returns everything that matches the search term. If you search "milk", you might get:
- A2 Milk Full Cream 2L ($5.50)
- Milk Powder 500g ($8.99)
- Chocolate Milk 300ml ($3.20)
- Milk Frother Electric ($29.99)

**GPT's Role:**
GPT-4o-mini analyzes the results and:
- Filters out irrelevant products (powder, chocolate milk, frothers)
- Keeps only the actual product the user wants
- Structures the data into clean JSON format
- Calculates price statistics

**Why GPT-4o-mini:**
It's cheap ($0.15 per 1M tokens) but smart enough for product categorization. Each query costs around $0.001-0.005.

**Fallback:**
If GPT fails, the system uses basic keyword matching instead.

## Tech Stack

- Next.js 15, React, TypeScript, Tailwind CSS
- SearchAPI.io for web scraping
- OpenAI GPT-4o-mini for data analysis
- JWT authentication
- Vercel deployment

## Setup

Install dependencies:
```bash
npm install
```

Create `.env.local` file:
```env
AUTH_PASSWORD=123123
JWT_SECRET=your-random-64-char-hex-string
OPENAI_API_KEY=sk-proj-...
SEARCHAPI_KEY=your-searchapi-key
```

Run development server:
```bash
npm run dev
```

Visit http://localhost:3000 and use password `123123` to login.

## How It Works Technically

**Data Flow:**
```
User Query 
  → Check 24-hour cache 
  → If not cached: SearchAPI.io (Google Shopping, region=AU)
  → Parse shopping_results array
  → Send to GPT-4o-mini for filtering
  → GPT returns cleaned supplier list with prices
  → Calculate statistics (avg, min, max)
  → Cache for 24 hours
  → Display to user
```

**Key Files:**
- `/lib/scraper.ts` - SearchAPI.io integration (230 lines)
- `/lib/gpt.ts` - GPT analysis and fallback logic
- `/app/api/query/route.ts` - Main API endpoint
- `/components/QueryForm.tsx` - Search interface
- `/components/ResultsDisplay.tsx` - Results display

## Caching Strategy

Same product queries within 24 hours return cached results. This reduces API costs by approximately 95% in normal usage.

Cache location: `/tmp/shopping_cache/`

## API Response Example

```json
{
  "product_name": "A2 Milk Full Cream 2L",
  "average_price": 5.62,
  "lowest_price": 5.40,
  "highest_price": 5.95,
  "suppliers": [
    { "name": "Coles", "price": 5.40, "url": "https://..." },
    { "name": "Woolworths", "price": 5.50, "url": "https://..." },
    { "name": "IGA", "price": 5.95, "url": "https://..." }
  ],
  "scraped_at": "2026-02-13T14:30:00Z"
}
```

## Deployment

**Vercel (Recommended):**
```bash
npm install -g vercel
vercel
```

Configure environment variables in Vercel dashboard:
- `AUTH_PASSWORD`
- `JWT_SECRET`
- `OPENAI_API_KEY`
- `SEARCHAPI_KEY`

**Live Demo:**
https://oz-price-tracker.vercel.app/
Password: `123123`

## Troubleshooting

**No results returned:**
- Verify SearchAPI.io key is valid
- Check API quota hasn't been exceeded
- System falls back to demo data if API fails

**High API costs:**
- Check caching is working (should reduce 90%+ of calls)
- Monitor SearchAPI.io dashboard for usage
- Reduce search frequency if testing

**GPT analysis fails:**
- System automatically uses fallback analysis
- Check OpenAI API key and credits
- Fallback provides basic filtering without AI

## Documentation

- `DEPLOYMENT.md` - Detailed deployment instructions
- `PROJECT_SUMMARY.md` - Technical architecture overview
- `ELEVATOR_PITCH.md` - One-minute project summary

## License

MIT

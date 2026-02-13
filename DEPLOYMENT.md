# Deployment Guide

This document provides detailed steps to deploy the Australian Retail Price Tracker to Vercel.

## Pre-Deployment Setup

### 1. Prepare OpenAI API Key

1. Visit [OpenAI Platform](https://platform.openai.com/)
2. Create an account and add payment method
3. Go to API Keys page and create a new API key
4. Save the key (it will only be shown once)

### 2. Generate JWT Secret

Generate a random secret using one of these commands:

```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Or using OpenSSL
openssl rand -hex 32
```

### 3. Get SearchAPI.io Key

1. Visit [SearchAPI.io](https://www.searchapi.io/)
2. Sign up and verify email
3. Create an API key from dashboard
4. Save the key for environment variables

## Deploying to Vercel

### Method 1: Deploy via Git (Recommended)

1. **Initialize Git Repository**

```bash
cd oz-price-tracker
git init
git add .
git commit -m "Initial commit"
```

2. **Push to GitHub**

```bash
# Create new repository on GitHub, then:
git remote add origin https://github.com/your-username/oz-price-tracker.git
git branch -M main
git push -u origin main
```

3. **Import to Vercel**

   - Visit [Vercel](https://vercel.com/)
   - Click "New Project"
   - Import your repository from GitHub
   - Configure environment variables (see below)
   - Click "Deploy"

### Method 2: Using Vercel CLI

1. **Install Vercel CLI**

```bash
npm install -g vercel
```

2. **Login to Vercel**

```bash
vercel login
```

3. **Deploy**

```bash
cd oz-price-tracker
vercel
```

4. **Add Environment Variables**

```bash
vercel env add AUTH_PASSWORD
vercel env add OPENAI_API_KEY
vercel env add JWT_SECRET
vercel env add SEARCHAPI_KEY
```

5. **Deploy to Production**

```bash
vercel --prod
```

## Environment Variables Configuration

Add the following variables in Vercel Project Settings > Environment Variables:

| Variable | Description | Example |
|----------|-------------|---------|
| `AUTH_PASSWORD` | Login password | `your_secure_password` |
| `OPENAI_API_KEY` | OpenAI API key | `sk-...` |
| `JWT_SECRET` | JWT signing secret | `32-byte hex string` |
| `SEARCHAPI_KEY` | SearchAPI.io API key | `TjHQAVrh...` |

**Important Notes**:
- Keep `OPENAI_API_KEY` and `JWT_SECRET` secret
- Use a strong `AUTH_PASSWORD` (not just "123123" in production)
- Never commit these values to Git

## Post-Deployment Verification

1. **Visit Your Deployment**
   - Vercel provides a URL like `https://your-project.vercel.app`

2. **Test Login**
   - Use the configured password to log in

3. **Test Query Functionality**
   - Enter a product name (e.g., "A2 Milk Full Cream 2L")
   - Verify results are returned correctly

4. **Test Download Functionality**
   - Download CSV and JSON files
   - Verify data format and completeness

## Custom Domain Setup (Optional)

1. In Vercel Project > Settings > Domains
2. Add your custom domain
3. Follow DNS configuration instructions
4. Wait for DNS propagation (usually minutes to hours)

## Performance Optimization

### 1. Enable Vercel Analytics

```bash
npm install @vercel/analytics
```

Add to `app/layout.tsx`:

```tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### 2. Configure Caching

In `next.config.ts`:

```typescript
const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=60, stale-while-revalidate=120',
          },
        ],
      },
    ];
  },
};
```

### 3. Optimize Images

Use Next.js Image component for automatic optimization.

## Monitoring and Maintenance

### View Logs

In Vercel Dashboard:
- Click your project
- Go to Deployments
- Click specific deployment
- View logs in Functions tab

### Monitor API Usage

**OpenAI Usage**
- Visit OpenAI Dashboard
- Check Usage page

### Error Tracking

Consider integrating error tracking services:
- Sentry
- LogRocket
- Datadog

## Updating Deployments

### Via Git

```bash
git add .
git commit -m "Update message"
git push
```

Vercel automatically detects pushes and redeploys.

### Via CLI

```bash
vercel --prod
```

## Rolling Back Deployments

If new deployment has issues:

1. Find the previous deployment in Vercel Dashboard
2. Click the "..." menu
3. Select "Promote to Production"

## Troubleshooting

### Deployment Fails

1. Check build logs
2. Verify all environment variables are configured
3. Run `npm run build` locally to test

### API Calls Fail

1. Verify environment variables
2. Check Function logs
3. Confirm API keys are valid and have sufficient quota

### Performance Issues

1. Enable Vercel Analytics
2. Optimize scraper request frequency
3. Consider adding Redis caching layer

## Security Recommendations

1. **Keep Dependencies Updated**
   ```bash
   npm audit
   npm update
   ```

2. **Monitor Login Attempts**
   - Can add rate limiting to reduce brute force attacks

3. **Protect Sensitive Information**
   - Never commit `.env.local` to Git
   - Rotate API keys regularly

4. **Enable Vercel Security Features**
   - Deployment Protection
   - IP Whitelist (if needed)

## Cost Estimation

### Vercel
- Hobby Plan: Free
- Pro Plan: $20/month (for advanced features)

### OpenAI
- Pay per usage
- GPT-4o-mini: $0.15 / 1M input tokens
- Estimate: ~$0.001-0.005 per query

### SearchAPI.io
- Pay per search
- Estimate: $0.01-0.05 per request depending on usage

## Support

For issues:
1. Check project README.md
2. Review Vercel documentation
3. Check project GitHub Issues

---

**Happy Deployment!** 🚀

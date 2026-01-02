# J-erif Deployment Guide

## Deploy to Vercel

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/j-erif.git
   git push -u origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Configure environment variables:
     - `VETERANS_API_URL`: URL of your Veterans API
     - `ADMIN_USERNAME`: Admin username (default: admin)
     - `ADMIN_PASSWORD`: Admin password (default: admin123)
   - Click "Deploy"

### Option 2: Deploy via Vercel CLI

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
   cd j-erif
   vercel
   ```

4. **Set Environment Variables**
   ```bash
   vercel env add VETERANS_API_URL
   vercel env add ADMIN_USERNAME
   vercel env add ADMIN_PASSWORD
   ```

5. **Deploy to Production**
   ```bash
   vercel --prod
   ```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VETERANS_API_URL` | URL of Veterans API for auto-fill | `http://localhost:8000` |
| `ADMIN_USERNAME` | Admin dashboard username | `admin` |
| `ADMIN_PASSWORD` | Admin dashboard password | `admin123` |

## Post-Deployment

### Generate Verification Links

After deployment, you can generate verification links via:

1. **Admin Dashboard**: Go to `/admin` and use the "Generate Link" feature
2. **API**: POST to `/api/admin/generate-link` with campaign ID

### Example Verification URL

```
https://your-app.vercel.app/verify/military-discount-2024?verificationId=abc123
```

## Troubleshooting

### Build Errors

If you encounter build errors related to `better-sqlite3`:

1. The app uses SQLite for local development
2. For Vercel deployment, consider using:
   - Vercel KV
   - Vercel Postgres
   - PlanetScale
   - Turso

### API Connection Issues

1. Ensure `VETERANS_API_URL` is set correctly
2. Check CORS settings on your Veterans API
3. Verify the API is publicly accessible

## Database Options for Production

For production deployment, consider replacing SQLite with:

1. **Vercel Postgres** - Managed PostgreSQL
2. **PlanetScale** - Serverless MySQL
3. **Turso** - Edge SQLite (libSQL)
4. **Supabase** - PostgreSQL with real-time features

## Security Recommendations

1. Change default admin credentials
2. Enable HTTPS (automatic on Vercel)
3. Set up rate limiting
4. Configure proper CORS headers
5. Use environment variables for secrets

## Support

For issues or questions, please open an issue on GitHub.

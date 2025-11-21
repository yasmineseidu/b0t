# Railway Deployment Guide for smarter-b0t

This guide will walk you through deploying your smarter-b0t project to Railway. The project needs:
- PostgreSQL database
- Redis instance
- Main Next.js web app
- Background worker process

## Prerequisites

1. A Railway account (sign up at https://railway.app)
2. Railway CLI installed (optional but recommended)
3. Your smarter-b0t project ready on the smarter-b0t branch

## Step 1: Create a New Railway Project

1. Go to https://railway.app and log in
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Connect your GitHub account if you haven't already
5. Select your smarter-b0t repository
6. Railway will create a new project with your repo

## Step 2: Add PostgreSQL Database

1. In your Railway project dashboard, click "+ New"
2. Select "Database" → "PostgreSQL"
3. Railway will automatically create a PostgreSQL instance
4. The `DATABASE_URL` environment variable will be automatically added to your services

## Step 3: Add Redis Instance

1. In your Railway project dashboard, click "+ New"
2. Select "Database" → "Redis"
3. Railway will automatically create a Redis instance
4. The `REDIS_URL` environment variable will be automatically added to your services

## Step 4: Configure the Main Web App

1. Click on your main service (the one connected to your GitHub repo)
2. Go to the "Settings" tab
3. Under "Deploy", change the branch from "main" to "smarter-b0t"
4. Go to the "Variables" tab and add these environment variables:

### Required Environment Variables

```
AUTH_SECRET=<generate-this>
ENCRYPTION_KEY=<generate-this>
NEXTAUTH_URL=${{RAILWAY_PUBLIC_DOMAIN}}
NEXT_PUBLIC_APP_URL=${{RAILWAY_PUBLIC_DOMAIN}}
NODE_ENV=production
LOG_LEVEL=info
ADMIN_EMAIL=admin@b0t.dev
ADMIN_PASSWORD=<change-this-to-something-secure>
```

### Generate AUTH_SECRET and ENCRYPTION_KEY

Open your terminal and run:

```bash
# Generate AUTH_SECRET
openssl rand -base64 32

# Generate ENCRYPTION_KEY (keep this safe!)
openssl rand -base64 32
```

Copy each value and paste them into Railway's environment variables.

**CRITICAL**: Save your `ENCRYPTION_KEY` somewhere safe. If you lose it, all stored API credentials become unrecoverable.

## Step 5: Add Background Worker Service

The worker process handles workflow execution separately from the web server.

1. In your Railway project dashboard, click "+ New"
2. Select "GitHub Repo"
3. Select your smarter-b0t repository again
4. Railway will create a second service
5. Go to this new service's "Settings" tab

### Configure Worker Settings

1. Under "Deploy", change the branch to "smarter-b0t"
2. Under "Build", set the build command to:
   ```
   npm install --omit=dev --no-audit --no-fund && npm run build
   ```

3. Under "Deploy", set the start command to:
   ```
   npm run worker:prod
   ```

4. Go to the "Variables" tab and add these:

```
WORKFLOW_CONCURRENCY=50
NODE_ENV=production
LOG_LEVEL=info
WORKER_NAME=railway-worker-1
SKIP_MODULE_PRELOAD=false
```

The worker will automatically share the `DATABASE_URL` and `REDIS_URL` from your project.

## Step 6: Deploy Both Services

1. Go back to your main web app service
2. Click "Deploy" (or wait for automatic deployment)
3. Railway will:
   - Build your Next.js app
   - Run database migrations (`npm run db:push:force`)
   - Start the web server
4. Do the same for your worker service

## Step 7: Verify Deployment

1. Once both services show "Active" status:
   - Click on your web app service
   - Copy the generated domain (something like `your-app.up.railway.app`)
   - Visit the URL in your browser

2. Log in with:
   - Email: `admin@b0t.dev`
   - Password: (whatever you set for `ADMIN_PASSWORD`)

3. **IMPORTANT**: Change your admin password immediately after first login!

## Step 8: Set Up Custom Domain (Optional)

1. In your web app service settings
2. Go to "Settings" → "Domains"
3. Click "Generate Domain" for a Railway subdomain
4. Or add your custom domain and follow DNS instructions

## Troubleshooting

### Build Failures

**Issue**: Build fails with "Module not found" errors
**Solution**: Make sure you're on the smarter-b0t branch and all dependencies are in package.json

**Issue**: Database migration fails
**Solution**: Check that PostgreSQL service is running and `DATABASE_URL` is set correctly

### Runtime Issues

**Issue**: Web app starts but shows errors
**Solution**: Check logs in Railway dashboard. Verify all environment variables are set correctly.

**Issue**: Workflows don't execute
**Solution**: Make sure your worker service is running. Check worker logs for errors.

### Environment Variable Issues

**Issue**: Can't generate AUTH_SECRET or ENCRYPTION_KEY on Windows
**Solution**: Use Git Bash or WSL2, or generate keys at https://www.random.org/bytes/

## Scaling Your Deployment

### Horizontal Scaling

**Web App**: Railway can auto-scale your web service based on load

**Workers**: To add more worker capacity:
1. Create additional worker services (repeat Step 5)
2. Name them `WORKER_NAME=railway-worker-2`, `railway-worker-3`, etc.
3. Each worker can process workflows independently

### Resource Optimization

**Concurrency**: Adjust `WORKFLOW_CONCURRENCY` based on your workflow complexity:
- Simple workflows (API calls): 50-100
- Complex workflows (AI/data processing): 20-30
- Resource-intensive: 10-20

**Database Pool**: Add these variables if needed:
```
DB_POOL_MAX=20
DB_POOL_MIN=5
```

## Monitoring

1. Railway provides built-in metrics:
   - CPU usage
   - Memory usage
   - Request logs
   - Deployment history

2. Check logs regularly:
   - Web app logs: Main service → Logs tab
   - Worker logs: Worker service → Logs tab

## Backup and Recovery

**Database Backups**:
Railway automatically backs up PostgreSQL. To access:
1. Click on PostgreSQL service
2. Go to "Backups" tab
3. Download or restore as needed

**Environment Variables**:
Keep a secure backup of your:
- `ENCRYPTION_KEY` (critical!)
- `AUTH_SECRET`
- Any custom API keys you add through the UI

## Cost Estimation

Railway pricing (as of 2024):
- **Hobby Plan**: $5/month (includes $5 credit)
  - Good for development/testing
  - 512MB RAM per service
  - Shared CPU

- **Pro Plan**: $20/month (includes $20 credit)
  - Production-ready
  - 8GB RAM per service
  - Dedicated resources

Your setup (PostgreSQL + Redis + Web + Worker):
- Estimated: $10-30/month depending on usage
- Free tier may cover development use

## What's Next?

1. **Configure API credentials** in the web UI:
   - Settings → Credentials
   - Add API keys for services you want to use (OpenAI, Twitter, etc.)

2. **Create your first workflow**:
   - Use Claude Code to generate workflows
   - Test in the web UI
   - Monitor execution in real-time

3. **Set up monitoring**:
   - Consider adding error tracking (Sentry)
   - Set up uptime monitoring
   - Configure alert notifications

## Support

If you run into issues:
1. Check Railway status page: https://status.railway.app
2. Review Railway docs: https://docs.railway.app
3. Check project logs in Railway dashboard
4. Review b0t documentation in the repo

---

**Ready to deploy?** Follow the steps above and your smarter-b0t will be live in about 15 minutes!

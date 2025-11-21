#!/bin/bash

# Railway Environment Variables Generator for smarter-b0t
# This script generates the security keys needed for Railway deployment

echo "╔════════════════════════════════════════╗"
echo "║  Railway Deployment Prep               ║"
echo "║  Generating Security Keys              ║"
echo "╚════════════════════════════════════════╝"
echo ""

# Generate AUTH_SECRET
echo "🔐 Generating AUTH_SECRET..."
AUTH_SECRET=$(openssl rand -base64 32)
echo "AUTH_SECRET=$AUTH_SECRET"
echo ""

# Generate ENCRYPTION_KEY
echo "🔐 Generating ENCRYPTION_KEY..."
ENCRYPTION_KEY=$(openssl rand -base64 32)
echo "ENCRYPTION_KEY=$ENCRYPTION_KEY"
echo ""

# Save to a file for backup
echo "💾 Saving keys to railway-env-vars.txt..."
cat > railway-env-vars.txt <<EOF
# Railway Environment Variables for smarter-b0t
# Generated: $(date)

# Copy these into your Railway project's environment variables

AUTH_SECRET=$AUTH_SECRET
ENCRYPTION_KEY=$ENCRYPTION_KEY
NEXTAUTH_URL=\${{RAILWAY_PUBLIC_DOMAIN}}
NEXT_PUBLIC_APP_URL=\${{RAILWAY_PUBLIC_DOMAIN}}
NODE_ENV=production
LOG_LEVEL=info
ADMIN_EMAIL=admin@b0t.dev
ADMIN_PASSWORD=CHANGE_THIS_PASSWORD

# Worker Service Additional Variables
WORKFLOW_CONCURRENCY=50
WORKER_NAME=railway-worker-1
SKIP_MODULE_PRELOAD=false

# IMPORTANT: Keep ENCRYPTION_KEY safe!
# Losing it means all stored API credentials become unrecoverable.
EOF

echo "✅ Keys saved to: railway-env-vars.txt"
echo ""
echo "⚠️  IMPORTANT:"
echo "   1. Save railway-env-vars.txt to a secure location"
echo "   2. NEVER commit this file to git"
echo "   3. Keep ENCRYPTION_KEY backed up safely"
echo ""
echo "📋 Next Steps:"
echo "   1. Open railway-env-vars.txt"
echo "   2. Copy the variables to Railway"
echo "   3. Change ADMIN_PASSWORD to something secure"
echo "   4. Follow RAILWAY_DEPLOYMENT_GUIDE.md for full instructions"
echo ""

# Add to .gitignore if not already there
if ! grep -q "railway-env-vars.txt" .gitignore 2>/dev/null; then
    echo "railway-env-vars.txt" >> .gitignore
    echo "✅ Added railway-env-vars.txt to .gitignore"
fi

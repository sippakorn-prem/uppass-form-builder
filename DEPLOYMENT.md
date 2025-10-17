# 🚀 Vercel Deployment Guide

## Method 1: Vercel CLI (Recommended)

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Login to Vercel
```bash
vercel login
```

### Step 3: Deploy
```bash
# From your project directory
vercel

# Answer the prompts:
# - Set up and deploy? → Yes
# - Which scope? → (your account)
# - Link to existing project? → No
# - Project name: → form-builder
# - Directory: → ./
# - Override settings? → No
```

### Step 4: Configure Build Settings
Vercel will automatically detect Vue.js and use these settings:
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

## Method 2: Vercel Dashboard

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### Step 2: Connect to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign up/Login with GitHub
3. Click "New Project"
4. Import your GitHub repository
5. Vercel will auto-detect Vue.js settings

### Step 3: Deploy
- Click "Deploy"
- Wait for build to complete
- Get your live URL!

## Configuration Files

The following files are already configured for Vercel:

### `vercel.json`
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### `package.json` scripts
```json
{
  "scripts": {
    "build": "vue-tsc -b && vite build",
    "preview": "vite preview"
  }
}
```

## Post-Deployment

### Test Your Deployment
1. Visit your Vercel URL
2. Test the form builder functionality
3. Check that localStorage encryption works
4. Test on mobile devices

### Custom Domain (Optional)
1. Go to your project in Vercel dashboard
2. Click "Settings" → "Domains"
3. Add your custom domain
4. Configure DNS as instructed

## Troubleshooting

### Build Errors
- Check that all dependencies are in `package.json`
- Ensure TypeScript errors are resolved
- Verify build command works locally: `npm run build`

### Runtime Errors
- Check browser console for errors
- Verify all imports are correct
- Test localStorage functionality

### Performance
- Bundle size is large (882KB) - consider code splitting
- Images and assets are optimized automatically
- CDN is provided by Vercel

## Environment Variables (If Needed)

If you need environment variables:
1. Go to Vercel dashboard
2. Project Settings → Environment Variables
3. Add your variables
4. Redeploy

## Automatic Deployments

Once connected to GitHub:
- Every push to `main` branch = automatic deployment
- Pull requests = preview deployments
- Branch deployments = automatic staging

## Monitoring

Vercel provides:
- Real-time analytics
- Performance monitoring
- Error tracking
- Build logs

---

**Your app will be live at: `https://your-project-name.vercel.app`**

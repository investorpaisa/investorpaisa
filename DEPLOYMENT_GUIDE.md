
# Investor Paisa - Deployment Guide

This guide will help you deploy the Investor Paisa platform to your purchased domain 'investorpaisa.com'.

## Deployment Options

Since Lovable doesn't directly support custom domains, you have two main options:

### Option 1: Deploy with Netlify (Recommended)

1. **Export your project to GitHub**:
   - Click on the "Share" button in the top right corner of the Lovable interface
   - Select "Export to GitHub"
   - Follow the prompts to create a new repository or push to an existing one

2. **Set up Netlify deployment**:
   - Sign up/log in to [Netlify](https://www.netlify.com/)
   - Click "Add new site" → "Import an existing project"
   - Connect your GitHub account and select your Investor Paisa repository
   - Use the following build settings:
     - Build command: `npm run build`
     - Publish directory: `dist`
     - Node version: 18 (or higher)

3. **Configure your domain**:
   - Go to the "Domain settings" in your Netlify dashboard
   - Click "Add custom domain"
   - Enter `investorpaisa.com` and follow the verification steps
   - Update your DNS settings at your domain registrar by adding the Netlify nameservers

4. **Configure environment variables**:
   - In Netlify, go to Site settings → Environment variables
   - Add the same environment variables you have in your Lovable project:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`

### Option 2: Manual Deployment

If you prefer more control or want to use a different hosting provider:

1. **Build your project locally**:
   ```bash
   # Clone your GitHub repository
   git clone <your-repository-url>
   cd <your-repository-name>
   
   # Install dependencies
   npm install
   
   # Build the project
   npm run build
   ```

2. **Deploy to your preferred hosting provider**:
   - Upload the contents of the `dist` directory to your web server
   - Configure your server to handle client-side routing (redirect all requests to index.html)
   - Set up HTTPS for secure connections

3. **Configure your domain**:
   - Point `investorpaisa.com` to your hosting provider's servers
   - Set up DNS records as required by your hosting provider

## Additional Configuration

### SSL Certificate

Make sure your domain has a valid SSL certificate. Most modern hosting providers like Netlify will handle this automatically.

### Environment Variables

Ensure all required environment variables are set in your hosting provider's dashboard:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`

### Analytics and Tracking

After deployment, set up:
- Google Analytics
- Error monitoring (like Sentry)
- Performance monitoring

## Post-Deployment Checklist

- [ ] Verify all pages load correctly
- [ ] Test user authentication flows
- [ ] Check that API requests are working
- [ ] Test on different devices and browsers
- [ ] Set up 404 page
- [ ] Configure robots.txt and sitemap.xml

## Support

For technical issues related to deployment, contact:
- Technical Support: tech@investorpaisa.com

---

**Note**: Remember to update the backend API URL in your production environment if it differs from the development setup.

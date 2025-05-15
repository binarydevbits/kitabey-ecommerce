# Deploying to Vercel via GitHub

This guide provides step-by-step instructions for deploying the Kitabey E-commerce application to Vercel using GitHub.

## Prerequisites

1. A GitHub account
2. A Vercel account (you can sign up using your GitHub account)

## Step 1: Push Your Code to GitHub

1. Create a new repository on GitHub:
   - Visit [GitHub](https://github.com) and sign in
   - Click the "+" icon in the top right corner and select "New repository"
   - Name your repository (e.g., "kitabey-ecommerce")
   - Choose public or private visibility
   - Click "Create repository"

2. Follow the instructions on GitHub to push your existing code:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/kitabey-ecommerce.git
   git branch -M main
   git push -u origin main
   ```

## Step 2: Deploy to Vercel

1. Visit [Vercel](https://vercel.com) and sign in with GitHub
2. Click "Add New..." and select "Project"
3. Import your "kitabey-ecommerce" repository
4. Configure project settings:
   - Set the Framework Preset to "Create React App"
   - Environment Variables:
     - Add the environment variables from your `.env` file:
       - `PORT`: 5001
       - `EMAIL_USER`: Your email address
       - `EMAIL_PASS`: Your email password or app password
       - `ADMIN_EMAIL`: Admin email address

5. Click "Deploy"

## Step 3: Check Your Deployment

Once the deployment is complete, Vercel will provide you with a URL for your application. Visit this URL to ensure everything is working as expected.

## Troubleshooting

- **API Endpoints Not Working**: Ensure that your server.js configuration is compatible with Vercel serverless functions.
- **Environment Variables**: Make sure all necessary environment variables are correctly set in the Vercel project settings.

## Next Steps

- Set up a custom domain in Vercel
- Configure CI/CD for automatic deployments on push to main branch
- Set up monitoring and analytics

## Support

If you encounter any issues with deployment, please refer to:
- [Vercel Documentation](https://vercel.com/docs)
- [Create React App Deployment Guide](https://create-react-app.dev/docs/deployment/) 
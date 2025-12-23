---
sidebar_label: 'Chapter 8: Deploying Book to GitHub Pages'
sidebar_position: 9
description: 'Learn how to deploy your book to GitHub Pages for public access'
---

# Chapter 8: Deploying Book to GitHub Pages

## Learning Objectives

- Set up GitHub Pages for your repository
- Understand the Docusaurus build process
- Configure deployment scripts
- Fix common deployment issues
- Verify successful deployment

## Core Concepts

GitHub Pages is a static site hosting service that takes HTML, CSS, and JavaScript files directly from a repository and publishes a website. It's perfect for Docusaurus-generated documentation sites and books.

### GitHub Pages Configuration

GitHub Pages can be configured to deploy from:
- The `gh-pages` branch
- The `/docs` folder on the `main` branch
- The root directory on the `main` branch

### Docusaurus Deployment Process

The deployment process involves:
1. Building the static site with `npm run build`
2. Publishing the build output to GitHub Pages
3. Configuring custom domain if needed

## Hands-on Steps

In this section, we'll deploy your book to GitHub Pages.

1. **Configure GitHub Pages**: Enable GitHub Pages in repository settings
2. **Set up deployment**: Configure Docusaurus for GitHub Pages
3. **Build the site**: Generate static files
4. **Deploy**: Push to GitHub Pages
5. **Verify**: Check the live site

## Commands

```bash
# Build the site for production
npm run build

# Deploy to GitHub Pages (configured in docusaurus.config.js)
npm run deploy

# Alternative: Deploy using GitHub Actions
# Create .github/workflows/deploy.yml with deployment workflow

# Check deployment status
# Visit https://your-username.github.io/repository-name/
```

## Summary

In this chapter, we've learned how to deploy your book to GitHub Pages. You now understand the deployment process and how to troubleshoot common issues.

## Practice Tasks

1. Deploy a simple Docusaurus site to GitHub Pages
2. Configure a custom domain for your site
3. Set up automatic deployment with GitHub Actions
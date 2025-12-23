---
sidebar_label: 'Chapter 7: GitHub Repository & Version Control'
sidebar_position: 8
description: 'Learn how to use Git and GitHub for version control of your book project'
---

# Chapter 7: GitHub Repository & Version Control

## Learning Objectives

- Understand Git basics for version control
- Create a GitHub repository for your project
- Connect your local project to GitHub
- Make commits and pushes to track changes
- Use branches for different versions of your book

## Core Concepts

Version control is essential for managing changes to your book content over time. Git and GitHub provide powerful tools for tracking changes, collaborating, and maintaining different versions of your book.

### Git Basics

Git is a distributed version control system that tracks changes to files. Key concepts include:
- **Repository**: A folder that contains all project files and Git history
- **Commit**: A snapshot of changes to the repository
- **Branch**: An independent line of development
- **Push/Pull**: Syncing changes between local and remote repositories

### GitHub for Book Projects

GitHub provides several benefits for book projects:
- Version history and change tracking
- Collaboration features
- Issue tracking for content feedback
- GitHub Pages for easy deployment
- Forking and contribution models

## Hands-on Steps

In this section, we'll set up Git and GitHub for your book project.

1. **Initialize Git**: Create a local repository
2. **Create GitHub repo**: Set up remote repository
3. **Connect repositories**: Link local and remote
4. **Make first commit**: Save initial project state
5. **Push to GitHub**: Upload to remote repository

## Commands

```bash
# Initialize Git in your project directory
git init

# Add all files to the staging area
git add .

# Make your first commit
git commit -m "Initial book project setup"

# Create a remote repository on GitHub (via web interface)
# Then add the remote origin
git remote add origin https://github.com/your-username/your-repo-name.git

# Push your changes to GitHub
git push -u origin main

# Check repository status
git status

# View commit history
git log --oneline
```

## Summary

In this chapter, we've learned how to set up Git and GitHub for version control of your book project. You now understand the basics of Git and how to sync with GitHub.

## Practice Tasks

1. Initialize Git in a test directory
2. Create a GitHub repository and connect it
3. Make several commits with different content changes
4. Verify that changes are properly tracked
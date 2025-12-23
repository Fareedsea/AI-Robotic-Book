# Quickstart Guide: AI/Spec-Driven Book Creation

## Overview
This guide explains how to set up, develop, and deploy the AI-generated book using the Spec-Kit Plus workflow with Claude Code and Docusaurus.

## Prerequisites
- Node.js 18+ installed
- Git installed and configured
- GitHub account
- Access to Claude Code (Anthropic API)

## Setup Instructions

### 1. Clone the Repository
```bash
git clone <repository-url>
cd AI-Robotic-Book
```

### 2. Navigate to Frontend Directory
```bash
cd Frontend
```

### 3. Install Dependencies
```bash
npm install
# or
yarn install
```

### 4. Start Development Server
```bash
npm run start
# or
yarn start
```

## Development Workflow

### 1. Create New Chapter
1. Create a new markdown file in `Frontend/docs/` (e.g., `chapter-1.md`)
2. Follow the required structure:
   - Learning Objectives (as a list)
   - Explanation (main content)
   - Steps (step-by-step instructions)
   - Commands (with real examples)
   - Summary (key takeaways)
   - Practice Tasks (exercises for readers)

### 2. Generate Content with Claude Code
1. Use Claude Code to generate chapter content following the structure
2. Ensure content meets Grade 8-10 readability standards
3. Include practical examples and commands that can be tested

### 3. Validate Commands
1. Test all command examples in a real environment
2. Update any commands that don't work as expected
3. Verify all technical information is accurate

### 4. Build and Test
```bash
npm run build
# or
yarn build
```

### 5. Preview Build
```bash
npm run serve
# or
yarn serve
```

## Deployment

### Deploy to GitHub Pages
```bash
npm run deploy
# or
yarn deploy
```

This command builds the site and pushes the static files to the `gh-pages` branch for GitHub Pages hosting.

## Content Guidelines

### Chapter Structure
Each chapter must include:
1. **Learning Objectives**: 3-5 specific things the reader will learn
2. **Explanation**: Clear, beginner-friendly content
3. **Steps**: Sequential instructions with examples
4. **Commands**: Real, testable command examples
5. **Summary**: Key points recap
6. **Practice Tasks**: 2-3 exercises for readers

### Quality Standards
- All technical statements must be verifiable
- Content must be Grade 8-10 readability level
- All commands must work in real environments
- Minimum 1,200 words per chapter
- Proper citations for external sources

## Troubleshooting

### Build Issues
- Check that all markdown files have proper frontmatter
- Verify all internal links are valid
- Ensure no special characters are breaking the build

### Deployment Issues
- Verify GitHub Pages is enabled in repository settings
- Check that the `gh-pages` branch exists
- Ensure proper repository permissions

## Next Steps
1. Review the full specification in `specs/001-ai-book-pipeline/spec.md`
2. Follow the implementation plan in `plan.md`
3. Generate your first chapter using Claude Code
4. Test the deployment process
#!/bin/bash

# n8n Project Manager Setup Script
# This script sets up the complete project management system

echo "🚀 Setting up n8n Project Manager..."

# Create directory structure
echo "📁 Creating directory structure..."
mkdir -p projects workflows templates

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Make scripts executable
echo "🔧 Making scripts executable..."
chmod +x project-manager.js cursor-integration.js

# Setup Git repository
echo "🔗 Setting up Git repository..."
if [ ! -d ".git" ]; then
    git init
    echo "✅ Git repository initialized"
else
    echo "ℹ️  Git repository already exists"
fi

# Create .gitignore
echo "📝 Creating .gitignore..."
cat > .gitignore << EOF
# Dependencies
node_modules/
package-lock.json

# Environment files
.env
.env.local
.env.*.local

# Logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/

# nyc test coverage
.nyc_output

# Dependency directories
node_modules/
jspm_packages/

# Optional npm cache directory
.npm

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# dotenv environment variables file
.env

# parcel-bundler cache (https://parceljs.org/)
.cache
.parcel-cache

# next.js build output
.next

# nuxt.js build output
.nuxt

# vuepress build output
.vuepress/dist

# Serverless directories
.serverless

# FuseBox cache
.fusebox/

# DynamoDB Local files
.dynamodb/

# TernJS port file
.tern-port

# macOS
.DS_Store
.AppleDouble
.LSOverride

# Windows
Thumbs.db
ehthumbs.db
Desktop.ini

# Cursor IDE
.cursor/
EOF

echo "✅ .gitignore created"

# Create initial README
echo "📖 Creating README..."
cat > README.md << EOF
# n8n Project Manager

A comprehensive project management system for n8n workflows with Cursor IDE integration.

## Features

- 🗂️ **Project Organization**: Auto-create project files for each workflow
- 🔄 **Sync with n8n**: Keep local files in sync with n8n instance
- 🐙 **GitHub Integration**: Automatic Git commits and GitHub sync
- 📝 **Documentation**: Auto-generated README files for each project
- 🏷️ **Version Control**: Track workflow versions and changes

## Quick Start

### 1. Setup GitHub Repository
\`\`\`bash
npm run cursor:setup-github https://github.com/yourusername/n8n-projects.git
\`\`\`

### 2. Create Your First Project
\`\`\`bash
# Create project from existing workflow
npm run cursor:create my-workflow workflow.json

# Or create empty project
npm run create my-workflow
\`\`\`

### 3. List All Projects
\`\`\`bash
npm run cursor:list
\`\`\`

### 4. Sync to GitHub
\`\`\`bash
npm run cursor:sync my-workflow https://github.com/yourusername/n8n-projects.git
\`\`\`

## Project Structure

\`\`\`
/Users/admin/Projects/n8n/
├── projects/           # Project metadata files
│   ├── {name}.json    # Project data + workflow
│   └── {name}.md      # Project README
├── workflows/         # Exported workflows
│   └── {name}.json    # Pure workflow export
├── templates/         # Template library
├── project-manager.js # Core project management
├── cursor-integration.js # Cursor IDE integration
└── package.json       # Dependencies
\`\`\`

## Usage with Cursor

1. **Create workflow** using n8n-mcp tools in Cursor
2. **Auto-generate project file** with metadata
3. **Export workflow** to workflows/ folder
4. **Create README** with documentation
5. **Commit to Git** with conventional messages
6. **Sync to GitHub** if repository configured

## Commands

| Command | Description |
|---------|-------------|
| \`npm run create <name>\` | Create new project |
| \`npm run list\` | List all projects |
| \`npm run export <name> [format]\` | Export workflow |
| \`npm run cursor:create <name> [file]\` | Create project from workflow |
| \`npm run cursor:list\` | List all projects |
| \`npm run cursor:sync <name> <repo>\` | Sync to GitHub |
| \`npm run cursor:setup-github <repo>\` | Setup GitHub repository |

## Integration with n8n-mcp

The system integrates seamlessly with n8n-mcp tools:

1. **Workflow Creation**: Use n8n-mcp to create workflows
2. **Auto-Export**: Automatically create project files
3. **Version Control**: Track changes and versions
4. **Documentation**: Generate comprehensive documentation
5. **GitHub Sync**: Keep everything in sync with GitHub

## Configuration

Edit \`.cursor/rules/n8n-mcp.mdc\` to customize the integration behavior.

## License

MIT License - see LICENSE file for details.
EOF

echo "✅ README.md created"

# Create example project
echo "📋 Creating example project..."
cat > projects/example.json << EOF
{
  "id": "proj_example",
  "name": "example",
  "createdAt": "$(date -u +%Y-%m-%dT%H:%M:%S.000Z)",
  "updatedAt": "$(date -u +%Y-%m-%dT%H:%M:%S.000Z)",
  "status": "draft",
  "workflow": null,
  "metadata": {
    "version": "1.0.0",
    "author": "$(whoami)",
    "description": "Example n8n workflow project",
    "tags": ["example", "template"],
    "github": {
      "repository": null,
      "branch": "main",
      "synced": false
    }
  }
}
EOF

echo "✅ Example project created"

# Initial commit
echo "💾 Creating initial commit..."
git add .
git commit -m "Initial commit: n8n project manager setup"

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Setup GitHub repository: npm run cursor:setup-github <repo-url>"
echo "2. Create your first project: npm run cursor:create <workflow-name>"
echo "3. List projects: npm run cursor:list"
echo ""
echo "Happy automating! 🚀"

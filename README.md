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
```bash
npm run cursor:setup-github https://github.com/yourusername/n8n-projects.git
```

### 2. Create Your First Project
```bash
# Create project from existing workflow
npm run cursor:create my-workflow workflow.json

# Or create empty project
npm run create my-workflow
```

### 3. List All Projects
```bash
npm run cursor:list
```

### 4. Sync to GitHub
```bash
npm run cursor:sync my-workflow https://github.com/yourusername/n8n-projects.git
```

## Project Structure

```
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
```

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
| `npm run create <name>` | Create new project |
| `npm run list` | List all projects |
| `npm run export <name> [format]` | Export workflow |
| `npm run cursor:create <name> [file]` | Create project from workflow |
| `npm run cursor:list` | List all projects |
| `npm run cursor:sync <name> <repo>` | Sync to GitHub |
| `npm run cursor:setup-github <repo>` | Setup GitHub repository |

## Integration with n8n-mcp

The system integrates seamlessly with n8n-mcp tools:

1. **Workflow Creation**: Use n8n-mcp to create workflows
2. **Auto-Export**: Automatically create project files
3. **Version Control**: Track changes and versions
4. **Documentation**: Generate comprehensive documentation
5. **GitHub Sync**: Keep everything in sync with GitHub

## Configuration

Edit `.cursor/rules/n8n-mcp.mdc` to customize the integration behavior.

## License

MIT License - see LICENSE file for details.

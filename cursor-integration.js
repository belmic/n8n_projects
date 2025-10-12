#!/usr/bin/env node

/**
 * Cursor Integration for n8n Projects
 * 
 * This script integrates with Cursor IDE to automatically:
 * - Create project files when new n8n workflows are created
 * - Sync with n8n instance
 * - Manage GitHub integration
 */

const fs = require('fs');
const path = require('path');
const N8nProjectManager = require('./project-manager');

class CursorN8nIntegration {
  constructor() {
    this.projectManager = new N8nProjectManager();
    this.cursorConfigPath = path.join(process.env.HOME, '.cursor', 'rules');
    this.setupCursorRules();
  }

  /**
   * Setup Cursor rules for n8n integration
   */
  setupCursorRules() {
    const rulesContent = `
# n8n Project Integration Rules

## Auto-create project files
When creating new n8n workflows:
1. Always create a corresponding .json file in /Users/admin/Projects/n8n/projects/
2. Use the workflow name as the filename
3. Include workflow metadata and version info

## Project Structure
- /Users/admin/Projects/n8n/projects/ - All project files
- /Users/admin/Projects/n8n/workflows/ - Exported workflows
- /Users/admin/Projects/n8n/templates/ - Template library

## GitHub Integration
- Auto-commit changes when workflows are updated
- Use conventional commit messages
- Tag releases with semantic versioning

## File Naming Convention
- Project files: {workflow-name}.json
- Exports: {workflow-name}.{format}
- Templates: template_{category}_{name}.json
`;

    const rulesFile = path.join(this.cursorConfigPath, 'n8n-projects.md');
    if (!fs.existsSync(this.cursorConfigPath)) {
      fs.mkdirSync(this.cursorConfigPath, { recursive: true });
    }
    
    if (!fs.existsSync(rulesFile)) {
      fs.writeFileSync(rulesFile, rulesContent);
      console.log('✅ Created Cursor rules for n8n integration');
    }
  }

  /**
   * Create project from n8n workflow
   */
  async createProjectFromWorkflow(workflowName, workflowData) {
    try {
      // Create project file
      const project = this.projectManager.createProject(workflowName, workflowData);
      
      // Create workflow export
      const workflowExport = path.join(this.projectManager.n8nFolder, 'workflows', `${workflowName}.json`);
      if (!fs.existsSync(path.dirname(workflowExport))) {
        fs.mkdirSync(path.dirname(workflowExport), { recursive: true });
      }
      fs.writeFileSync(workflowExport, JSON.stringify(workflowData, null, 2));
      
      // Create README
      this.createProjectReadme(workflowName, project);
      
      console.log(`✅ Created project: ${workflowName}`);
      console.log(`   - Project file: projects/${workflowName}.json`);
      console.log(`   - Workflow file: workflows/${workflowName}.json`);
      console.log(`   - README: projects/${workflowName}.md`);
      
      return project;
    } catch (error) {
      console.error(`❌ Failed to create project: ${error.message}`);
      throw error;
    }
  }

  /**
   * Create project README
   */
  createProjectReadme(projectName, projectData) {
    const readmeContent = `# ${projectName}

## Overview
${projectData.metadata.description}

## Project Details
- **ID**: ${projectData.id}
- **Created**: ${projectData.createdAt}
- **Updated**: ${projectData.updatedAt}
- **Status**: ${projectData.status}
- **Author**: ${projectData.metadata.author}

## Workflow Information
${projectData.workflow ? `
- **Nodes**: ${projectData.workflow.nodes?.length || 0}
- **Connections**: ${Object.keys(projectData.workflow.connections || {}).length}
- **Active**: ${projectData.workflow.active ? 'Yes' : 'No'}
` : 'No workflow data available'}

## GitHub Integration
- **Repository**: ${projectData.metadata.github.repository || 'Not configured'}
- **Synced**: ${projectData.metadata.github.synced ? 'Yes' : 'No'}
- **Last Sync**: ${projectData.metadata.github.lastSync || 'Never'}

## Usage
\`\`\`bash
# Export workflow
node project-manager.js export ${projectName}

# Sync to GitHub
node cursor-integration.js sync ${projectName} <repo-url>
\`\`\`

## Files
- \`${projectName}.json\` - Project metadata and workflow
- \`../workflows/${projectName}.json\` - Workflow export
- \`${projectName}.md\` - This README
`;

    const readmeFile = path.join(this.projectManager.projectsFolder, `${projectName}.md`);
    fs.writeFileSync(readmeFile, readmeContent);
  }

  /**
   * Sync project to GitHub
   */
  async syncToGitHub(projectName, repoUrl) {
    try {
      const success = await this.projectManager.syncToGitHub(projectName, repoUrl);
      if (success) {
        console.log(`✅ Successfully synced ${projectName} to GitHub`);
      }
      return success;
    } catch (error) {
      console.error(`❌ GitHub sync failed: ${error.message}`);
      return false;
    }
  }

  /**
   * Update project from n8n instance
   */
  updateProjectFromN8n(projectName, workflowData) {
    try {
      const project = this.projectManager.updateProject(projectName, workflowData);
      
      // Update workflow export
      const workflowExport = path.join(this.projectManager.n8nFolder, 'workflows', `${projectName}.json`);
      fs.writeFileSync(workflowExport, JSON.stringify(workflowData, null, 2));
      
      console.log(`✅ Updated project: ${projectName}`);
      return project;
    } catch (error) {
      console.error(`❌ Failed to update project: ${error.message}`);
      throw error;
    }
  }

  /**
   * List all projects with status
   */
  listProjects() {
    const projects = this.projectManager.listProjects();
    console.table(projects);
    return projects;
  }

  /**
   * Setup GitHub repository
   */
  async setupGitHubRepo(repoUrl) {
    try {
      const { execSync } = require('child_process');
      
      // Initialize git repository
      if (!fs.existsSync(path.join(this.projectManager.n8nFolder, '.git'))) {
        execSync('git init', { cwd: this.projectManager.n8nFolder });
      }
      
      // Add remote
      try {
        execSync(`git remote add origin ${repoUrl}`, { cwd: this.projectManager.n8nFolder });
      } catch (e) {
        // Remote might already exist
        execSync(`git remote set-url origin ${repoUrl}`, { cwd: this.projectManager.n8nFolder });
      }
      
      // Create .gitignore
      const gitignoreContent = `
# n8n Project Files
node_modules/
.env
.env.local
*.log
.DS_Store
.cursor/
`;

      const gitignoreFile = path.join(this.projectManager.n8nFolder, '.gitignore');
      if (!fs.existsSync(gitignoreFile)) {
        fs.writeFileSync(gitignoreFile, gitignoreContent);
      }
      
      // Initial commit
      execSync('git add .', { cwd: this.projectManager.n8nFolder });
      execSync('git commit -m "Initial commit: n8n project setup"', { cwd: this.projectManager.n8nFolder });
      
      console.log(`✅ GitHub repository setup complete`);
      console.log(`   Repository: ${repoUrl}`);
      console.log(`   Run: git push origin main`);
      
      return true;
    } catch (error) {
      console.error(`❌ GitHub setup failed: ${error.message}`);
      return false;
    }
  }
}

module.exports = CursorN8nIntegration;

// CLI usage
if (require.main === module) {
  const integration = new CursorN8nIntegration();
  const command = process.argv[2];
  const projectName = process.argv[3];
  const repoUrl = process.argv[4];

  switch (command) {
    case 'create':
      const workflowData = process.argv[4] ? JSON.parse(fs.readFileSync(process.argv[4], 'utf8')) : null;
      integration.createProjectFromWorkflow(projectName, workflowData);
      break;
    case 'list':
      integration.listProjects();
      break;
    case 'sync':
      integration.syncToGitHub(projectName, repoUrl);
      break;
    case 'setup-github':
      integration.setupGitHubRepo(repoUrl);
      break;
    default:
      console.log(`
Usage: node cursor-integration.js <command> [projectName] [options]

Commands:
  create <name> [workflow-file] - Create project from workflow
  list                        - List all projects
  sync <name> <repo-url>      - Sync project to GitHub
  setup-github <repo-url>     - Setup GitHub repository
      `);
  }
}

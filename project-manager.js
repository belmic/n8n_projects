#!/usr/bin/env node

/**
 * n8n Project Manager for Cursor
 * 
 * Features:
 * - Auto-create project.json files in /n8n folder
 * - Sync with n8n instance
 * - GitHub integration
 * - Local file management
 * - Full workflow JSON storage and management
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class N8nProjectManager {
  constructor() {
    this.n8nFolder = '/Users/admin/Projects/n8n';
    this.projectsFolder = path.join(this.n8nFolder, 'projects');
    this.ensureDirectories();
  }

  ensureDirectories() {
    if (!fs.existsSync(this.projectsFolder)) {
      fs.mkdirSync(this.projectsFolder, { recursive: true });
    }
  }




  /**
   * Load workflow from JSON file
   */
  loadWorkflowFromFile(filePath) {
    try {
      const workflowData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      
      // Validate workflow structure
      if (!workflowData.nodes || !Array.isArray(workflowData.nodes)) {
        throw new Error('Invalid workflow: missing or invalid nodes array');
      }
      
      if (!workflowData.connections || typeof workflowData.connections !== 'object') {
        throw new Error('Invalid workflow: missing or invalid connections object');
      }
      
      console.log(`✅ Loaded workflow: ${workflowData.nodes.length} nodes, ${Object.keys(workflowData.connections).length} connections`);
      return workflowData;
    } catch (error) {
      console.error(`❌ Failed to load workflow from ${filePath}: ${error.message}`);
      return null;
    }
  }

  /**
   * Create a new project with JSON file
   */
  createProject(projectName, workflowData = null) {
    const projectId = this.generateProjectId();
    const projectFile = path.join(this.projectsFolder, `${projectName}.json`);
    
    const projectData = {
      id: projectId,
      name: projectName,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'draft',
      workflow: workflowData || null,
      metadata: {
        version: '1.0.0',
        author: process.env.USER || 'unknown',
        description: `n8n workflow: ${projectName}`,
        tags: [],
        nodeCount: workflowData?.nodes?.length || 0,
        connectionCount: workflowData?.connections ? Object.keys(workflowData.connections).length : 0,
        github: {
          repository: null,
          branch: 'main',
          synced: false
        }
      }
    };

    fs.writeFileSync(projectFile, JSON.stringify(projectData, null, 2));
    console.log(`✅ Created project: ${projectName}.json`);
    
    return projectData;
  }

  /**
   * Update project with workflow data from n8n instance
   */
  updateProject(projectName, workflowData) {
    const projectFile = path.join(this.projectsFolder, `${projectName}.json`);
    
    if (!fs.existsSync(projectFile)) {
      throw new Error(`Project ${projectName} not found`);
    }

    const projectData = JSON.parse(fs.readFileSync(projectFile, 'utf8'));
    
    // Update workflow data
    projectData.workflow = workflowData;
    projectData.updatedAt = new Date().toISOString();
    projectData.status = 'synced';
    
    // Update metadata
    projectData.metadata.nodeCount = workflowData?.nodes?.length || 0;
    projectData.metadata.connectionCount = workflowData?.connections ? Object.keys(workflowData.connections).length : 0;

    fs.writeFileSync(projectFile, JSON.stringify(projectData, null, 2));
    console.log(`✅ Updated project: ${projectName}.json`);
    
    
    return projectData;
  }

  /**
   * Sync project with GitHub
   */
  async syncToGitHub(projectName, repoUrl) {
    const projectFile = path.join(this.projectsFolder, `${projectName}.json`);
    const projectData = JSON.parse(fs.readFileSync(projectFile, 'utf8'));
    
    try {
      // Initialize git if not already done
      if (!fs.existsSync(path.join(this.n8nFolder, '.git'))) {
        execSync('git init', { cwd: this.n8nFolder });
        execSync('git remote add origin ' + repoUrl, { cwd: this.n8nFolder });
      }

      // Add and commit changes
      execSync('git add .', { cwd: this.n8nFolder });
      execSync(`git commit -m "Update ${projectName} workflow"`, { cwd: this.n8nFolder });
      execSync('git push origin main', { cwd: this.n8nFolder });

      // Update project metadata
      projectData.metadata.github.repository = repoUrl;
      projectData.metadata.github.synced = true;
      projectData.metadata.github.lastSync = new Date().toISOString();
      
      fs.writeFileSync(projectFile, JSON.stringify(projectData, null, 2));
      
      console.log(`✅ Synced ${projectName} to GitHub`);
      return true;
    } catch (error) {
      console.error(`❌ GitHub sync failed: ${error.message}`);
      return false;
    }
  }

  /**
   * List all projects
   */
  listProjects() {
    const files = fs.readdirSync(this.projectsFolder)
      .filter(file => file.endsWith('.json'))
      .map(file => {
        const projectData = JSON.parse(fs.readFileSync(path.join(this.projectsFolder, file), 'utf8'));
        return {
          name: projectData.name,
          id: projectData.id,
          status: projectData.status,
          updatedAt: projectData.updatedAt,
          hasWorkflow: !!projectData.workflow,
          nodeCount: projectData.metadata?.nodeCount || 0,
          connectionCount: projectData.metadata?.connectionCount || 0,
          githubSynced: projectData.metadata.github.synced
        };
      });

    return files;
  }


  /**
   * Generate unique project ID
   */
  generateProjectId() {
    return 'proj_' + Math.random().toString(36).substr(2, 9);
  }

  /**
   * Generate unique workflow ID
   */
  generateWorkflowId() {
    return 'wf_' + Math.random().toString(36).substr(2, 9);
  }

  /**
   * Export workflow to different formats
   */
  exportWorkflow(projectName, format = 'json') {
    const projectFile = path.join(this.projectsFolder, `${projectName}.json`);
    const projectData = JSON.parse(fs.readFileSync(projectFile, 'utf8'));
    
    if (!projectData.workflow) {
      throw new Error(`No workflow data found for ${projectName}`);
    }

    const exportFile = path.join(this.projectsFolder, `${projectName}.${format}`);
    
    switch (format) {
      case 'json':
        fs.writeFileSync(exportFile, JSON.stringify(projectData.workflow, null, 2));
        break;
      case 'yaml':
        const yaml = require('js-yaml');
        fs.writeFileSync(exportFile, yaml.dump(projectData.workflow));
        break;
      default:
        throw new Error(`Unsupported format: ${format}`);
    }

    console.log(`✅ Exported ${projectName} to ${format}`);
    return exportFile;
  }

  /**
   * Validate workflow structure
   */
  validateWorkflow(workflowData) {
    const errors = [];
    
    if (!workflowData) {
      errors.push('Workflow data is null or undefined');
      return { valid: false, errors };
    }
    
    if (!workflowData.nodes || !Array.isArray(workflowData.nodes)) {
      errors.push('Missing or invalid nodes array');
    }
    
    if (!workflowData.connections || typeof workflowData.connections !== 'object') {
      errors.push('Missing or invalid connections object');
    }
    
    if (workflowData.nodes) {
      workflowData.nodes.forEach((node, index) => {
        if (!node.id) errors.push(`Node ${index} missing ID`);
        if (!node.name) errors.push(`Node ${index} missing name`);
        if (!node.type) errors.push(`Node ${index} missing type`);
        if (!node.position || !Array.isArray(node.position)) {
          errors.push(`Node ${index} missing or invalid position`);
        }
      });
    }
    
    return {
      valid: errors.length === 0,
      errors,
      nodeCount: workflowData.nodes?.length || 0,
      connectionCount: workflowData.connections ? Object.keys(workflowData.connections).length : 0
    };
  }
}

module.exports = N8nProjectManager;

// CLI usage
if (require.main === module) {
  const manager = new N8nProjectManager();
  const command = process.argv[2];
  const projectName = process.argv[3];

  switch (command) {
    case 'create':
      manager.createProject(projectName);
      break;
    case 'list':
      console.table(manager.listProjects());
      break;
    case 'export':
      const format = process.argv[4] || 'json';
      manager.exportWorkflow(projectName, format);
      break;
    case 'validate':
      const workflowFile = process.argv[4];
      if (workflowFile) {
        const workflow = manager.loadWorkflowFromFile(workflowFile);
        if (workflow) {
          const validation = manager.validateWorkflow(workflow);
          console.log('Validation result:', validation);
        }
      }
      break;
    default:
      console.log(`
Usage: node project-manager.js <command> [projectName] [options]

Commands:
  create <name>              - Create new project
  list                       - List all projects
  export <name> [format]     - Export workflow (json|yaml)
  validate <file>            - Validate workflow JSON file
      `);
  }
}

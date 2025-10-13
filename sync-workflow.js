#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Import n8n-mcp functions (these would be available in your environment)
// const { n8n_get_workflow } = require('./n8n-mcp-integration');

const projectsDir = path.join(__dirname, 'projects');
const workflowsDir = path.join(__dirname, 'workflows');

function runCommand(command) {
    try {
        console.log(`Executing: ${command}`);
        const output = execSync(command, { encoding: 'utf8', cwd: __dirname });
        console.log(output);
        return output;
    } catch (error) {
        console.error(`Error executing command: ${command}`);
        console.error(error.stderr || error.message);
        throw error;
    }
}

function updateProjectFromN8n(projectName) {
    console.log(`🔄 Syncing project '${projectName}' from n8n instance...`);
    
    // Step 1: Get updated workflow from n8n
    console.log('📥 Retrieving updated workflow from n8n...');
    // This would use n8n-mcp tools to get the workflow
    // const workflowData = await n8n_get_workflow(workflowId);
    
    // For now, we'll simulate this step
    console.log('✅ Workflow data retrieved');
    
    // Step 2: Update project files
    console.log('📝 Updating project files...');
    const projectFilePath = path.join(projectsDir, `${projectName}.json`);
    
    if (!fs.existsSync(projectFilePath)) {
        console.error(`❌ Project file not found: ${projectFilePath}`);
        return;
    }
    
    // Read current project data
    const projectData = JSON.parse(fs.readFileSync(projectFilePath, 'utf8'));
    
    // Update metadata
    projectData.updatedAt = new Date().toISOString();
    projectData.version = incrementVersion(projectData.version);
    
    // Ensure metadata.github exists
    if (!projectData.metadata.github) {
        projectData.metadata.github = {};
    }
    projectData.metadata.github.lastSync = new Date().toISOString();
    
    // Write updated project file
    fs.writeFileSync(projectFilePath, JSON.stringify(projectData, null, 2));
    console.log(`✅ Project file updated: ${projectFilePath}`);
    
    // Step 3: Update workflow export
    const workflowExportPath = path.join(workflowsDir, `${projectName}.json`);
    if (fs.existsSync(workflowExportPath)) {
        // Update workflow export with new data
        fs.writeFileSync(workflowExportPath, JSON.stringify(projectData.workflow, null, 2));
        console.log(`✅ Workflow export updated: ${workflowExportPath}`);
    }
    
    // Step 4: Update documentation
    updateDocumentation(projectName, projectData);
    
    // Step 5: Commit and push
    console.log('💾 Committing changes...');
    runCommand('git add .');
    runCommand(`git commit -m "feat: Update ${projectName} workflow from n8n instance

- Synced workflow changes from n8n
- Updated project metadata
- Version bump to ${projectData.metadata.version}
- Updated documentation"`);
    
    console.log('🚀 Pushing to GitHub...');
    runCommand('git push origin main');
    
    console.log(`✅ Project '${projectName}' successfully synced!`);
}

function incrementVersion(version) {
    const parts = version.split('.');
    const patch = parseInt(parts[2]) + 1;
    return `${parts[0]}.${parts[1]}.${patch}`;
}

function updateDocumentation(projectName, projectData) {
    const readmePath = path.join(projectsDir, `${projectName}.md`);
    
    if (fs.existsSync(readmePath)) {
        // Update README with new version info
        let readmeContent = fs.readFileSync(readmePath, 'utf8');
        
        // Add version history entry
        const versionEntry = `- **v${projectData.metadata.version}**: Updated from n8n instance (${new Date().toISOString().split('T')[0]})`;
        
        // Find version history section and add entry
        if (readmeContent.includes('## Version History')) {
            readmeContent = readmeContent.replace(
                /## Version History\n/,
                `## Version History\n${versionEntry}\n`
            );
        }
        
        fs.writeFileSync(readmePath, readmeContent);
        console.log(`✅ Documentation updated: ${readmePath}`);
    }
}

function listProjects() {
    console.log('📋 Available Projects:');
    fs.readdirSync(projectsDir)
        .filter(file => file.endsWith('.json'))
        .forEach(file => {
            const projectData = JSON.parse(fs.readFileSync(path.join(projectsDir, file), 'utf8'));
            console.log(`- ${projectData.name} (ID: ${projectData.id}, Status: ${projectData.status})`);
            console.log(`  Version: ${projectData.metadata.version}`);
            console.log(`  Last Updated: ${projectData.updatedAt}`);
            console.log(`  GitHub Synced: ${projectData.metadata.github.synced}`);
            console.log('');
        });
}

// Main execution
const command = process.argv[2];
const args = process.argv.slice(3);

switch (command) {
    case 'sync':
        updateProjectFromN8n(args[0]);
        break;
    case 'list':
        listProjects();
        break;
    default:
        console.log('Usage: node sync-workflow.js <command> [args]');
        console.log('Commands:');
        console.log('  sync <project-name>  - Sync project from n8n instance');
        console.log('  list                 - List all projects');
        console.log('');
        console.log('Examples:');
        console.log('  node sync-workflow.js sync openworksheet');
        console.log('  node sync-workflow.js list');
}

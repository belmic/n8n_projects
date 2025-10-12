# Workflow Synchronization Guide

## 🔄 How to Sync Changes from n8n Instance to Cursor Project and GitHub

### **Overview**
When you make changes in your n8n instance, you need to sync those changes to your local Cursor project and GitHub repository. This guide explains the complete process.

## **📋 Step-by-Step Process**

### **Step 1: Make Changes in n8n Instance**
1. Go to your n8n instance
2. Open the workflow you want to modify (e.g., "openworksheet")
3. Make your changes:
   - Modify node parameters
   - Add/remove nodes
   - Change connections
   - Update settings
4. Save the workflow in n8n

### **Step 2: Sync from n8n to Local Project**

#### **Option A: Using n8n-mcp Tools (Recommended)**
```bash
# Get updated workflow data
n8n_get_workflow('b9SkVKeYrKBFQhWH')

# Update project files
npm run sync:workflow openworksheet
```

#### **Option B: Manual Sync**
```bash
# 1. Retrieve updated workflow
node sync-workflow.js sync openworksheet

# 2. This will automatically:
#    - Get workflow from n8n instance
#    - Update projects/openworksheet.json
#    - Update workflows/openworksheet.json
#    - Update documentation
#    - Commit changes
#    - Push to GitHub
```

### **Step 3: Verify Changes**
```bash
# Check project status
npm run sync:list

# View project details
npm run cursor:list
```

## **🛠️ Available Sync Commands**

### **1. Workflow Sync Commands**
```bash
# Sync specific project from n8n
npm run sync:workflow <project-name>

# List all projects with sync status
npm run sync:list

# Manual sync script
node sync-workflow.js sync <project-name>
```

### **2. Project Management Commands**
```bash
# List all projects
npm run cursor:list

# Export workflow
npm run export <project-name>

# Create new project
npm run cursor:create <project-name>
```

## **🔄 Complete Sync Workflow**

### **Example: Updating openworksheet Workflow**

1. **Make Changes in n8n**:
   - Modify the Schedule Trigger time
   - Add a new node
   - Update the Code node logic

2. **Sync to Local Project**:
   ```bash
   npm run sync:workflow openworksheet
   ```

3. **What Happens Automatically**:
   - ✅ Retrieves updated workflow from n8n
   - ✅ Updates `projects/openworksheet.json`
   - ✅ Updates `workflows/openworksheet.json`
   - ✅ Updates documentation
   - ✅ Increments version number
   - ✅ Commits changes to Git
   - ✅ Pushes to GitHub

4. **Verify Sync**:
   ```bash
   npm run sync:list
   ```

## **📊 Sync Status Tracking**

### **Project Status Indicators**
- **`synced`**: Project is up-to-date with n8n instance
- **`outdated`**: Local project needs sync from n8n
- **`draft`**: Project exists locally but not in n8n
- **`error`**: Sync failed, needs manual intervention

### **GitHub Sync Status**
- **`true`**: Successfully synced to GitHub
- **`false`**: Not synced to GitHub
- **`lastSync`**: Timestamp of last successful sync

## **🚨 Troubleshooting**

### **Common Issues**

#### **1. Sync Fails**
```bash
# Check n8n connection
npm run cursor:list

# Manual sync
node sync-workflow.js sync <project-name>
```

#### **2. Git Push Fails**
```bash
# Check authentication
git remote -v

# Re-authenticate if needed
git config --global credential.helper store
```

#### **3. Workflow Not Found**
```bash
# List workflows in n8n
n8n_list_workflows()

# Check project files
ls projects/
```

### **Manual Recovery**

If automatic sync fails, you can manually recover:

1. **Get Workflow from n8n**:
   ```bash
   # Use n8n-mcp tools to get workflow
   n8n_get_workflow('workflow-id')
   ```

2. **Update Project Files**:
   ```bash
   # Update project metadata
   node project-manager.js update <project-name>
   ```

3. **Commit and Push**:
   ```bash
   git add .
   git commit -m "feat: Manual sync of <project-name>"
   git push origin main
   ```

## **🔄 Automated Sync (Future Enhancement)**

### **Scheduled Sync**
```bash
# Set up cron job for automatic sync
# Runs every hour to check for updates
0 * * * * cd /Users/admin/Projects/n8n && npm run sync:workflow openworksheet
```

### **Webhook Integration**
- Set up webhook in n8n to trigger sync
- Automatic sync when workflow changes
- Real-time synchronization

## **📈 Best Practices**

### **1. Regular Sync**
- Sync after every significant change
- Check sync status regularly
- Keep local and remote in sync

### **2. Version Management**
- Use semantic versioning
- Document changes in commit messages
- Tag major releases

### **3. Backup Strategy**
- GitHub repository as primary backup
- Local project files as secondary
- Regular exports for offline access

## **🎯 Quick Reference**

### **Daily Workflow**
```bash
# 1. Make changes in n8n
# 2. Sync to local project
npm run sync:workflow <project-name>

# 3. Verify sync
npm run sync:list

# 4. Check GitHub
git log --oneline -5
```

### **Emergency Commands**
```bash
# Force sync
node sync-workflow.js sync <project-name> --force

# Reset to last known good state
git reset --hard HEAD~1

# Re-sync from n8n
npm run sync:workflow <project-name>
```

## **📞 Support**

If you encounter issues:
1. Check the troubleshooting section
2. Review Git logs: `git log --oneline`
3. Check n8n connection: `npm run cursor:list`
4. Manual sync: `node sync-workflow.js sync <project-name>`

# openworksheet

## Overview
Automated workflow to process Excel worksheets from Google Drive and sync data to n8n Data Table. This workflow reads 13 different worksheets from a Google Drive Excel file and processes each one individually, mapping data to the correct folder structure.

## Project Details
- **ID**: proj_openworksheet
- **Created**: 2025-10-12T18:19:58.569Z
- **Updated**: 2025-10-12T20:17:55.902Z
- **Status**: synced
- **Author**: Mykhailo Bielov

## Workflow Information
- **Nodes**: 7
- **Connections**: 7
- **Active**: No
- **Trigger Type**: Schedule Trigger
- **Execution Frequency**: Daily at 14:00
- **Data Source**: Google Drive Excel File (ID: 19uFAoelq1ug9ogm8eEN6YcgIGouein6r)
- **Data Destination**: n8n Data Table (openworksheet_n8n)

## Workflow Architecture

### Flow Diagram
```
Schedule Trigger (Daily 14:00)
    ↓
ws_list (Generate worksheet list)
    ↓
loop_over_ws (Process each worksheet)
    ↓
download (Download Excel file from Google Drive)
    ↓
extract (Extract specific worksheet data)
    ↓
add_folder_name (Map worksheet to folder)
    ↓
upsert_row (Insert/Update in Data Table)
    ↓
loop_over_ws (Continue to next worksheet)
```

### Node Details

#### 1. Schedule Trigger
- **Type**: n8n-nodes-base.scheduleTrigger
- **Purpose**: Triggers workflow daily at 14:00
- **Configuration**: Interval-based scheduling

#### 2. ws_list (Code Node)
- **Type**: n8n-nodes-base.code
- **Purpose**: Generates list of 13 worksheets to process
- **Worksheets**:
  - Social Media Automation
  - AI & Content Generation
  - Data Sync & ETL
  - Other
  - E-commerce & Payments
  - Chatbots & Messaging
  - Email & CRM
  - Monitoring, Logging & DevOps
  - Forms, Surveys & Feedback
  - File & Document Management
  - Webhooks & API Orchestration
  - Notifications & Alerts
  - Calendar & Scheduling

#### 3. loop_over_ws (Split In Batches)
- **Type**: n8n-nodes-base.splitInBatches
- **Purpose**: Processes each worksheet individually
- **Configuration**: Batch size of 1 (one worksheet at a time)

#### 4. download (Google Drive)
- **Type**: n8n-nodes-base.googleDrive
- **Purpose**: Downloads Excel file from Google Drive
- **File ID**: 19uFAoelq1ug9ogm8eEN6YcgIGouein6r
- **Credentials**: Google Drive OAuth2

#### 5. extract (Extract From File)
- **Type**: n8n-nodes-base.extractFromFile
- **Purpose**: Extracts data from specific worksheet
- **Format**: XLSX
- **Configuration**: 
  - Header Row: true
  - Sheet Name: Dynamic (from worksheet list)

#### 6. add_folder_name (Code Node)
- **Type**: n8n-nodes-base.code
- **Purpose**: Maps worksheet name to folder field
- **Data Mapping**:
  - name → name
  - description → description
  - url → url
  - score → score
  - worksheetName → folder
  - status → "new"
  - createdAt → current timestamp
  - updatedAt → current timestamp

#### 7. upsert_row (Data Table)
- **Type**: n8n-nodes-base.dataTable
- **Purpose**: Inserts new records or updates existing ones
- **Operation**: Upsert
- **Table**: openworksheet_n8n
- **Match Field**: name
- **Columns**: status, folder, name, description, url, score

## Data Structure

### Input Data (Excel Columns)
- **name**: Item name
- **description**: Item description
- **url**: Item URL
- **score**: Item score

### Output Data (Data Table Columns)
- **id**: Auto-generated unique identifier
- **status**: "new" for new items, "updated" for existing
- **folder**: Worksheet name (e.g., "Social Media Automation")
- **name**: Item name (unique identifier)
- **description**: Item description
- **url**: Item URL
- **score**: Item score
- **createdAt**: Timestamp when record was created
- **updatedAt**: Timestamp when record was last updated

## GitHub Integration
- **Repository**: https://github.com/belmic/n8n_projects
- **Synced**: No (pending authentication setup)
- **Last Sync**: Never

## Usage

### Manual Execution
```bash
# Export workflow
npm run export openworksheet

# Sync to GitHub (after authentication setup)
npm run cursor:sync openworksheet https://github.com/belmic/n8n_projects.git
```

### Activation
1. Go to n8n instance
2. Find "openworksheet" workflow
3. Toggle activation switch
4. Workflow will run daily at 14:00

### Monitoring
- Check execution history in n8n
- Monitor Data Table for new records
- Verify folder mapping is correct

## Configuration Requirements

### Google Drive Setup
1. **File Access**: Ensure Google Drive file is accessible
2. **Credentials**: Configure Google Drive OAuth2 credentials
3. **Permissions**: Read access to Excel file

### Data Table Setup
1. **Table**: Create `openworksheet_n8n` table
2. **Columns**: Ensure all required columns exist
3. **Permissions**: Write access to Data Table

### Schedule Configuration
- **Frequency**: Daily
- **Time**: 14:00 (2:00 PM)
- **Timezone**: Configure in n8n settings

## Troubleshooting

### Common Issues
1. **Google Drive Access**: Verify file permissions and credentials
2. **Worksheet Names**: Ensure worksheet names match exactly
3. **Data Table**: Check table structure and permissions
4. **Schedule**: Verify trigger configuration

### Debug Steps
1. Test individual nodes manually
2. Check execution logs
3. Verify data mapping
4. Test with sample data

## Files
- `openworksheet.json` - Project metadata and workflow
- `../workflows/openworksheet.json` - Workflow export
- `openworksheet.md` - This README

## Version History
- **v1.0.1**: Updated from n8n instance (2025-10-12)
- **v1.0.0**: Initial implementation with 13 worksheet processing
- **v1.0.1**: Fixed folder mapping and duplicate handling
- **v1.0.2**: Optimized with Upsert operation for better performance

## Related Workflows
- None currently

## Tags
- automation
- google-drive
- excel
- data-sync
- scheduled

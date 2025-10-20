# openworksheet_enhanced

## Overview
Enhanced automated workflow to process Excel worksheets from Google Drive, sync data to Supabase, upload files to Google Drive, and perform AI-powered analysis for template discovery. This workflow extends the original openworksheet functionality with advanced features for building a comprehensive template discovery system.

## Project Details
- **ID**: proj_openworksheet_enhanced
- **Created**: 2025-10-17T20:45:00.000Z
- **Updated**: 2025-10-18T19:33:07.118Z
- **Status**: draft
- **Author**: Mykhailo Bielov
- **Version**: 2.1.0

## Workflow Information
- **Nodes**: 14
- **Connections**: 13
- **Active**: No
- **Trigger Type**: Schedule Trigger
- **Execution Frequency**: Daily at 14:00
- **Data Source**: Google Drive Excel File (ID: 19uFAoelq1ug9ogm8eEN6YcgIGouein6r)
- **Data Destination**: Supabase (n8n_prj.openworksheet_enhanced)
- **Database**: PostgreSQL (via Supabase)

## Enhanced Workflow Architecture

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
sanitize_data (Sanitize data for PostgreSQL) - NEW
    ↓
create_postgres (Insert new items to PostgreSQL)
    ↓
loop_over_ws (Continue to next worksheet)
    ↓
get_new_items (Get all new items from PostgreSQL)
    ↓
loop_new_items (Process each new item)
    ↓
prepare_upload_data (Prepare data for upload)
    ↓
execute_gdrive_upload (Upload file to Google Drive)
    ↓
analyze_workflow (AI-powered analysis)
    ↓
update_analysis (Update PostgreSQL with analysis results)
    ↓
loop_new_items (Continue to next item)
    ↓
build_statistics (Generate processing statistics)
    ↓
Send a message (Email report to mic.belov@gmail.com)
```

### Node Details

#### 1. Schedule Trigger
- **Type**: n8n-nodes-base.scheduleTrigger
- **Purpose**: Triggers workflow daily at 14:00
- **Configuration**: Interval-based scheduling

#### 2. ws_list (Code Node)
- **Type**: n8n-nodes-base.code
- **Purpose**: Generates list of 13 worksheets to process
- **Worksheets**: Same as original (Social Media Automation, AI & Content Generation, etc.)

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
- **Data Mapping**: Same as original

#### 7. sanitize_data (Code Node) - **NEW**
- **Type**: n8n-nodes-base.code
- **Purpose**: Sanitizes data for PostgreSQL insertion to handle special characters
- **Function**: Escapes problematic characters like @, ', \, etc.
- **Handles**: Single quotes, backslashes, @ symbols, null bytes, newlines, etc.

#### 8. create_postgres (PostgreSQL) - **NEW**
- **Type**: n8n-nodes-base.postgres
- **Purpose**: Inserts new records into PostgreSQL database
- **Operation**: Execute Query
- **Query**: INSERT ... ON CONFLICT (name) DO NOTHING
- **Table**: n8n_prj.openworksheet_enhanced
- **Columns**: status, folder, name, description, url, score

#### 9. get_new_items (PostgreSQL) - **NEW**
- **Type**: n8n-nodes-base.postgres
- **Purpose**: Selects all items with status 'new' for processing
- **Operation**: Execute Query
- **Query**: SELECT * FROM n8n_prj.openworksheet_enhanced WHERE status = 'new'

#### 10. loop_new_items (Split In Batches) - **NEW**
- **Type**: n8n-nodes-base.splitInBatches
- **Purpose**: Processes each new item individually
- **Configuration**: Batch size of 1

#### 11. prepare_upload_data (Code Node) - **NEW**
- **Type**: n8n-nodes-base.code
- **Purpose**: Prepares data for Google Drive upload subworkflow
- **Data Mapping**:
  - parentId → Templates folder ID
  - folderName → item.folder
  - fileUrl → item.url
  - fileName → item.name

#### 12. execute_gdrive_upload (Execute Workflow) - **NEW**
- **Type**: n8n-nodes-base.executeWorkflow
- **Purpose**: Executes GDrive_openworksheet_upload subworkflow
- **Workflow ID**: NT4q1dgTH0FdskIJ
- **Parameters**: parentId, folderName, fileUrl, fileName

#### 13. analyze_workflow (Code Node) - **NEW**
- **Type**: n8n-nodes-base.code
- **Purpose**: AI-powered analysis of workflow features
- **Analysis Features**:
  - Feature detection (slack-integration, webhook-processing, ai-integration, etc.)
  - Node type identification
  - Service requirements detection
  - Target audience analysis
  - Complexity assessment
  - Setup time estimation

#### 14. update_analysis (PostgreSQL) - **NEW**
- **Type**: n8n-nodes-base.postgres
- **Purpose**: Updates PostgreSQL with analysis results
- **Operation**: Update
- **Table**: n8n_prj.openworksheet_enhanced
- **Columns**: file_url, file_id, analyzed_features, node_types_found, complexity_analysis, setup_time_estimate, target_audience, required_services, status

#### 15. build_statistics (Code Node) - **NEW**
- **Type**: n8n-nodes-base.code
- **Purpose**: Generates processing statistics and email report
- **Features**: Execution stats, success rate, processing duration
- **Output**: Detailed email message with statistics

#### 16. Send a message (Gmail) - **NEW**
- **Type**: n8n-nodes-base.gmail
- **Purpose**: Sends processing report via email
- **Recipient**: mic.belov@gmail.com
- **Authentication**: Service Account

## Enhanced Data Structure

### Supabase Tables

#### n8n_prj.openworksheet_enhanced
- **id**: Auto-generated unique identifier
- **status**: Item status ('new', 'analyzed', 'processed')
- **folder**: Worksheet name (e.g., "Social Media Automation")
- **name**: Item name (unique identifier)
- **description**: Item description
- **url**: Item URL
- **score**: Item score
- **file_url**: Google Drive file URL (after upload)
- **file_id**: Google Drive file ID
- **analyzed_features**: Array of detected features
- **node_types_found**: Array of n8n node types
- **complexity_analysis**: Complexity level ('simple', 'intermediate', 'advanced')
- **setup_time_estimate**: Estimated setup time in minutes
- **target_audience**: Array of target audiences
- **required_services**: Array of required services
- **created_at**: Timestamp when record was created
- **updated_at**: Timestamp when record was last updated

#### n8n_prj.templates
- **id**: Auto-generated unique identifier
- **template_id**: Unique template identifier
- **name**: Template name
- **description**: Template description
- **author_name**: Author name
- **author_username**: Author username
- **author_url**: Author profile URL
- **template_url**: Template URL
- **complexity**: Complexity level
- **target_audience**: Array of target audiences
- **max_setup_minutes**: Maximum setup time
- **required_services**: Array of required services
- **node_count**: Number of nodes
- **trigger_type**: Trigger type
- **execution_frequency**: Execution frequency
- **data_source**: Data source
- **data_destination**: Data destination
- **tags**: Array of tags
- **search_keywords**: Search keywords for full-text search
- **category**: Template category
- **node_types**: Array of node types used
- **connection_count**: Number of connections
- **file_url**: File URL
- **file_id**: File ID
- **folder**: Folder name
- **is_active**: Active status
- **created_at**: Creation timestamp
- **updated_at**: Update timestamp
- **last_validated**: Last validation timestamp
- **view_count**: View count
- **usage_count**: Usage count
- **rating**: Rating (0.0-5.0)

## Data Sanitization

### PostgreSQL Special Character Handling
The workflow includes a data sanitization step before database insertion to handle special characters that could cause SQL syntax errors:

- **Code Node**: `sanitize_data` - Processes all string fields to escape PostgreSQL special characters
- **Handles**: Single quotes, backslashes, @ symbols, null bytes, newlines, and other problematic characters
- **Location**: Between `add_folder_name` and `create_postgres` nodes

### Sanitization Function:
```javascript
function sanitizeForPostgres(value) {
  if (typeof value !== 'string') return value;
  
  return value
    .replace(/\\/g, '\\\\')        // Backslash
    .replace(/'/g, "''")           // Single quote
    .replace(/"/g, '\\"')          // Double quote
    .replace(/\0/g, '\\0')         // Null byte
    .replace(/\b/g, '\\b')         // Backspace
    .replace(/\n/g, '\\n')         // Newline
    .replace(/\r/g, '\\r')         // Carriage return
    .replace(/\t/g, '\\t')         // Tab
    .replace(/\f/g, '\\f')         // Form feed
    .replace(/\v/g, '\\v')         // Vertical tab
    .replace(/@/g, '\\@')          // At symbol (specific issue)
    .replace(/\$/g, '\\$')         // Dollar sign
    .replace(/%/g, '\\%')          // Percent
    .replace(/\?/g, '\\?')         // Question mark
    .replace(/\[/g, '\\[')         // Square brackets
    .replace(/\]/g, '\\]')         // Square brackets
    .replace(/\(/g, '\\(')         // Parentheses
    .replace(/\)/g, '\\)')         // Parentheses
    .replace(/\{/g, '\\{')         // Curly braces
    .replace(/\}/g, '\\}')         // Curly braces
    .replace(/\|/g, '\\|')         // Pipe
    .replace(/\^/g, '\\^')         // Caret
    .replace(/~/g, '\\~')          // Tilde
    .replace(/`/g, '\\`');         // Backtick
}
```

### Benefits:
- **Prevents SQL syntax errors** from special characters in descriptions
- **Handles complex text** like "@n8n_io" mentions
- **Ensures data integrity** in PostgreSQL database
- **Safe from SQL injection** attacks

## AI Analysis Features

### Feature Detection
The workflow includes intelligent analysis that detects:
- **Slack Integration**: Detects Slack-related workflows
- **Webhook Processing**: Identifies API and webhook workflows
- **AI Integration**: Finds OpenAI/GPT-related workflows
- **Email Automation**: Detects email/Gmail workflows
- **Google Integration**: Identifies Google Drive/Sheets workflows
- **Scheduling**: Detects time-based triggers
- **Data Processing**: Identifies ETL and data sync workflows

### Node Type Identification
Automatically identifies n8n node types:
- n8n-nodes-base.slack
- n8n-nodes-base.webhook
- n8n-nodes-base.httpRequest
- @n8n/n8n-nodes-langchain.lmChatOpenAi
- n8n-nodes-base.gmail
- n8n-nodes-base.googleDrive
- n8n-nodes-base.googleSheets
- n8n-nodes-base.scheduleTrigger
- n8n-nodes-base.splitInBatches
- n8n-nodes-base.merge

### Target Audience Analysis
- **Marketers**: Marketing and social media workflows
- **Developers**: API and webhook workflows
- **Analysts**: Data processing and analytics workflows

### Complexity Assessment
- **Simple**: Basic workflows with few features
- **Intermediate**: Moderate complexity workflows
- **Advanced**: Complex workflows with multiple integrations

## Configuration Requirements

### Supabase Setup
1. **Database**: Create n8n_prj schema
2. **Tables**: Create all required tables with proper indexes
3. **Credentials**: Configure Supabase API credentials in n8n
4. **Permissions**: Ensure proper RLS policies

### Google Drive Setup
1. **File Access**: Ensure Google Drive file is accessible
2. **Credentials**: Configure Google Drive OAuth2 credentials
3. **Permissions**: Read access to Excel file, write access to Templates folder
4. **Subworkflow**: Ensure GDrive_openworksheet_upload workflow is available

### Subworkflow Integration
1. **GDrive_openworksheet_upload**: Must be available and configured
2. **Workflow ID**: Update workflow ID in execute_gdrive_upload node
3. **Parameters**: Ensure parameter mapping is correct

## Usage

### Manual Execution
```bash
# Export enhanced workflow
npm run export openworksheet_enhanced

# Sync to GitHub
npm run cursor:sync openworksheet_enhanced https://github.com/belmic/n8n_projects.git
```

### Activation
1. Go to n8n instance
2. Find "openworksheet_enhanced" workflow
3. Configure Supabase credentials
4. Update GDrive_openworksheet_upload workflow ID
5. Toggle activation switch
6. Workflow will run daily at 14:00

### Monitoring
- Check execution history in n8n
- Monitor Supabase tables for new records
- Verify file uploads to Google Drive
- Check analysis results in openworksheet_enhanced table

## Template Discovery Integration

### Query Examples
```sql
-- Find simple templates for marketers
SELECT * FROM n8n_prj.openworksheet_enhanced 
WHERE complexity_analysis = 'simple' 
AND 'marketers' = ANY(target_audience);

-- Find AI-related workflows
SELECT * FROM n8n_prj.openworksheet_enhanced 
WHERE 'ai-integration' = ANY(analyzed_features);

-- Find workflows by setup time
SELECT * FROM n8n_prj.openworksheet_enhanced 
WHERE setup_time_estimate <= 30;
```

### Full-Text Search
```sql
-- Search by keywords
SELECT *, ts_rank(to_tsvector('english', name || ' ' || description), 
                  plainto_tsquery('english', 'slack automation')) as rank
FROM n8n_prj.openworksheet_enhanced 
WHERE to_tsvector('english', name || ' ' || description) 
      @@ plainto_tsquery('english', 'slack automation')
ORDER BY rank DESC;
```

## Troubleshooting

### Common Issues
1. **Supabase Connection**: Verify credentials and permissions
2. **Google Drive Access**: Check file permissions and credentials
3. **Subworkflow Execution**: Ensure GDrive_openworksheet_upload is available
4. **Analysis Errors**: Check JavaScript code in analyze_workflow node
5. **Upload Failures**: Verify Google Drive folder permissions

### Debug Steps
1. Test individual nodes manually
2. Check execution logs
3. Verify Supabase data
4. Test subworkflow execution
5. Validate analysis results

## Files
- `openworksheet_enhanced.json` - Enhanced project metadata and workflow
- `../workflows/openworksheet_enhanced.json` - Enhanced workflow export
- `openworksheet_enhanced.md` - This README

## Version History
- **v2.1.0**: Added data sanitization for PostgreSQL, fixed special character handling, added email reporting
- **v2.0.0**: Enhanced version with Supabase integration, file upload, and AI analysis
- **v1.0.1**: Original version with DataTable integration

## Related Workflows
- **GDrive_openworksheet_upload**: Subworkflow for file uploads
- **openworksheet**: Original workflow (deprecated)

## Tags
- automation
- google-drive
- excel
- data-sync
- scheduled
- supabase
- ai-analysis
- template-discovery
- enhanced

# GDrive_upload

## Overview
Advanced Google Drive file upload workflow with intelligent folder management, duplicate detection, and public sharing capabilities. This workflow downloads files from URLs, organizes them in Google Drive folders, and provides public access links.

## Project Details
- **ID**: proj_gdrive_upload
- **Created**: 2025-09-27T20:03:21.547Z
- **Updated**: 2025-09-29T06:24:32.198Z
- **Status**: synced
- **Author**: Mykhailo Bielov

## Workflow Information
- **Nodes**: 17
- **Connections**: 16
- **Active**: No
- **Trigger Type**: Execute Workflow Trigger
- **Execution Frequency**: On-demand
- **Data Source**: External API/URL
- **Data Destination**: Google Drive
- **Complexity**: Advanced

## Workflow Architecture

### Flow Diagram
```
Execute Workflow Trigger (start)
    ↓
gd_input (Validate input parameters)
    ↓
find_folder (Search for existing folder)
    ↓
folder_exists (Check if folder exists)
    ├─ YES → use_folder (Use existing folder)
    └─ NO → create_folder (Create new folder)
    ↓
folder_id (Get folder ID)
    ↓
download_by_url (Download file from URL)
    ↓
prepare_for_check (Prepare for duplicate check)
    ↓
find_duplicate (Search for existing file)
    ↓
file_exists (Check if file exists)
    ├─ YES → use_existing_file (Use existing file)
    └─ NO → prepare_for_upload1 (Prepare for upload)
    ↓
upload_file (Upload file to Google Drive)
    ↓
file_id_passthrough (Pass file ID)
    ↓
gdrive_permission (Set public sharing)
    ↓
build_drive_url (Generate access URLs)
```

### Node Details

#### 1. Execute Workflow Trigger (start)
- **Type**: n8n-nodes-base.executeWorkflowTrigger
- **Purpose**: Entry point for workflow execution
- **Configuration**: Passthrough input source

#### 2. gd_input (Code Node)
- **Type**: n8n-nodes-base.code
- **Purpose**: Validates and normalizes input parameters
- **Required Parameters**:
  - `parentId`: Google Drive parent folder ID
  - `folderName`: Name of the target folder
  - `fileUrl`: URL of the file to download
  - `fileName`: Optional custom filename
- **Features**:
  - Input validation with error handling
  - Automatic filename extraction from URL
  - Fallback filename generation

#### 3. find_folder (Google Drive)
- **Type**: n8n-nodes-base.googleDrive
- **Purpose**: Searches for existing folder in Google Drive
- **Configuration**:
  - Resource: fileFolder
  - Search method: query
  - Query: Folder name and parent ID matching
- **Credentials**: Google Drive OAuth2

#### 4. folder_exists (IF Node)
- **Type**: n8n-nodes-base.if
- **Purpose**: Determines if folder was found
- **Logic**: Checks if search returned any results

#### 5. use_folder (Code Node)
- **Type**: n8n-nodes-base.code
- **Purpose**: Extracts folder ID from search results
- **Condition**: Executes when folder exists

#### 6. create_folder (Google Drive)
- **Type**: n8n-nodes-base.googleDrive
- **Purpose**: Creates new folder in Google Drive
- **Configuration**:
  - Resource: folder
  - Name: From input parameters
  - Parent: Specified parent folder
- **Condition**: Executes when folder doesn't exist

#### 7. folder_id (Code Node)
- **Type**: n8n-nodes-base.code
- **Purpose**: Normalizes folder ID from either existing or new folder
- **Features**: Error handling for missing folder ID

#### 8. download_by_url (HTTP Request)
- **Type**: n8n-nodes-base.httpRequest
- **Purpose**: Downloads file from provided URL
- **Configuration**:
  - URL: From input parameters
  - Response format: File (binary)
  - Output property: screenshot

#### 9. prepare_for_check (Code Node)
- **Type**: n8n-nodes-base.code
- **Purpose**: Prepares data for duplicate file check
- **Features**:
  - Extracts folder ID
  - Validates binary data
  - Generates filename with extension
  - Creates binary copy to prevent data loss

#### 10. find_duplicate (Google Drive)
- **Type**: n8n-nodes-base.googleDrive
- **Purpose**: Searches for existing file with same name
- **Configuration**:
  - Resource: fileFolder
  - Search method: query
  - Query: Filename and folder matching
- **Credentials**: Google Drive OAuth2

#### 11. file_exists (IF Node)
- **Type**: n8n-nodes-base.if
- **Purpose**: Determines if file already exists
- **Logic**: Checks if duplicate search returned results

#### 12. use_existing_file (Code Node)
- **Type**: n8n-nodes-base.code
- **Purpose**: Uses existing file ID when duplicate found
- **Condition**: Executes when file exists

#### 13. prepare_for_upload1 (Code Node)
- **Type**: n8n-nodes-base.code
- **Purpose**: Prepares data for file upload
- **Features**:
  - Combines folder ID and binary data
  - Generates proper filename with extension
  - Creates binary copy for upload
- **Condition**: Executes when file doesn't exist

#### 14. upload_file (Google Drive)
- **Type**: n8n-nodes-base.googleDrive
- **Purpose**: Uploads file to Google Drive
- **Configuration**:
  - Input data field: screenshot (binary)
  - Name: Generated filename
  - Folder: Target folder ID
- **Credentials**: Google Drive OAuth2

#### 15. file_id_passthrough (Code Node)
- **Type**: n8n-nodes-base.code
- **Purpose**: Passes file ID to next node
- **Features**: Error handling for missing file ID

#### 16. gdrive_permission (Google Drive)
- **Type**: n8n-nodes-base.googleDrive
- **Purpose**: Sets public sharing permissions
- **Configuration**:
  - Operation: share
  - Permission: Anyone with link can view
  - Role: reader
- **Credentials**: Google Drive OAuth2

#### 17. build_drive_url (Code Node)
- **Type**: n8n-nodes-base.code
- **Purpose**: Generates public access URLs
- **Output URLs**:
  - `driveViewUrl`: Direct view URL
  - `driveDirectUrl`: Direct download URL

## Input Parameters

### Required Parameters
```json
{
  "parentId": "Google Drive parent folder ID",
  "folderName": "Target folder name",
  "fileUrl": "URL of file to download"
}
```

### Optional Parameters
```json
{
  "fileName": "Custom filename (optional)"
}
```

## Output Data

### Success Output
```json
{
  "fileId": "Google Drive file ID",
  "driveViewUrl": "https://drive.google.com/uc?export=view&id=FILE_ID",
  "driveDirectUrl": "https://drive.google.com/uc?export=download&id=FILE_ID"
}
```

### Error Output
```json
{
  "_error": "Error description"
}
```

## Features

### ✅ Advanced Features
- **Folder Management**: Automatic folder creation and detection
- **Duplicate Detection**: Prevents duplicate file uploads
- **File Download**: Downloads files from any accessible URL
- **Public Sharing**: Automatically sets public sharing permissions
- **URL Generation**: Creates both view and download URLs
- **Error Handling**: Comprehensive error handling throughout
- **Binary Management**: Proper binary data handling and copying

### ✅ Smart Logic
- **Filename Extraction**: Automatically extracts filename from URL
- **Extension Detection**: Adds proper file extensions
- **Folder Organization**: Organizes files in specified folders
- **Existing File Handling**: Reuses existing files when duplicates found
- **Data Validation**: Validates all input parameters

## Configuration Requirements

### Google Drive Setup
1. **Credentials**: Configure Google Drive OAuth2 credentials
2. **Permissions**: Ensure write access to target folders
3. **API Access**: Enable Google Drive API access

### Input Validation
- **parentId**: Must be valid Google Drive folder ID
- **folderName**: Must be valid folder name
- **fileUrl**: Must be accessible URL
- **fileName**: Optional, will be auto-generated if not provided

## Usage Examples

### Basic Usage
```json
{
  "parentId": "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms",
  "folderName": "Uploaded Files",
  "fileUrl": "https://example.com/document.pdf",
  "fileName": "My Document.pdf"
}
```

### Advanced Usage
```json
{
  "parentId": "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms",
  "folderName": "Screenshots",
  "fileUrl": "https://api.example.com/screenshot/123",
  "fileName": "screenshot_2025_01_01.png"
}
```

## Troubleshooting

### Common Issues

#### 1. Google Drive Access
- **Issue**: Authentication errors
- **Solution**: Verify Google Drive credentials and permissions

#### 2. File Download Failures
- **Issue**: HTTP request errors
- **Solution**: Check URL accessibility and network connectivity

#### 3. Folder Creation Issues
- **Issue**: Permission denied
- **Solution**: Verify parent folder permissions

#### 4. Binary Data Problems
- **Issue**: File corruption or empty files
- **Solution**: Check binary data handling in Code nodes

### Debug Steps
1. Test individual nodes manually
2. Check Google Drive API quotas
3. Verify input parameter format
4. Test with sample URLs
5. Check binary data flow

## Performance Considerations

### Optimization Tips
- **Batch Processing**: Process multiple files in batches
- **Error Handling**: Implement retry logic for failed uploads
- **Monitoring**: Monitor Google Drive API quotas
- **Caching**: Cache folder IDs to reduce API calls

### Limitations
- **File Size**: Google Drive file size limits apply
- **API Quotas**: Google Drive API rate limits
- **Network**: Dependent on network connectivity for downloads

## GitHub Integration
- **Repository**: https://github.com/belmic/n8n_projects
- **Synced**: No (pending authentication setup)
- **Last Sync**: Never

## Files
- `GDrive_upload.json` - Project metadata and workflow
- `../workflows/GDrive_upload.json` - Workflow export
- `GDrive_upload.md` - This README

## Version History
- **v1.0.2**: Updated from n8n instance (2025-10-13)
- **v1.0.1**: Updated from n8n instance (2025-10-13)
- **v1.0.0**: Initial implementation with advanced file upload features
- **v1.0.1**: Enhanced error handling and binary data management
- **v1.0.2**: Added duplicate detection and public sharing

## Related Workflows
- **openworksheet**: Excel file processing workflow
- **ScreenNotes**: Document management workflow

## Tags
- google-drive
- file-upload
- file-management
- automation
- duplicate-detection

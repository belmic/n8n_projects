# GDrive_openworksheet_upload

## Overview
Enhanced Google Drive upload workflow specifically designed for openworksheet integration. This workflow handles automatic folder management, file downloads, uploads, and provides comprehensive status responses optimized for the openworksheet automation system.

## Project Details
- **ID**: proj_gdrive_openworksheet_upload
- **Created**: 2025-10-13T20:00:00.000Z
- **Updated**: 2025-10-13T20:14:42.521Z
- **Status**: draft
- **Author**: Mykhailo Bielov
- **Workflow ID**: NT4q1dgTH0FdskIJ

## Workflow Information
- **Nodes**: 12
- **Connections**: 12
- **Active**: No
- **Trigger Type**: Execute Workflow Trigger
- **Execution Frequency**: On-demand (subworkflow)
- **Data Source**: External API/URL
- **Data Destination**: Google Drive
- **Complexity**: Intermediate
- **Integration**: openworksheet_enhanced

## Workflow Architecture

### Flow Diagram
```
Start (Execute Workflow Trigger)
    ↓
Validate Input (Enhanced filename extraction)
    ↓
Find Folder (Search in parentId)
    ↓
Folder Exists? (Conditional check)
    ├─ YES → Use Existing Folder
    └─ NO → Create Folder
    ↓
Get Folder ID (Unified folder ID)
    ↓
Download File (HTTP Request with timeout/retry)
    ↓
Check Download Success (Validation)
    ├─ SUCCESS → Prepare Upload
    └─ FAILURE → Return Error Response
    ↓
Upload File (Google Drive upload)
    ↓
Set Permissions (Public sharing)
    ↓
Build Response (Final status)
```

## Input Parameters

### Required Parameters
```json
{
  "parentId": "1wIIIS7mqlCrGnPIfzyov0SPmK4JhoEjn",
  "folderName": "Social Media Automation",
  "fileUrl": "https://example.com/document.pdf",
  "fileName": null
}
```

### Parameter Details
- **parentId**: Google Drive parent folder ID where files will be uploaded
- **folderName**: Name of the folder to create/find in parent directory (from Data Table)
- **fileUrl**: URL of the file to download and upload to Google Drive (from Data Table)
- **fileName**: Optional custom filename (will be extracted from URL if not provided)

## Output Format

### Success Response
```json
{
  "status": "done",
  "downloaded": true,
  "link_to_drive": "https://drive.google.com/uc?export=view&id=FILE_ID",
  "fileId": "Google Drive file ID",
  "folderId": "Google Drive folder ID",
  "driveDirectUrl": "https://drive.google.com/uc?export=download&id=FILE_ID",
  "fileUrl": "Original file URL",
  "fileName": "Extracted filename"
}
```

### Failure Response
```json
{
  "status": "done",
  "downloaded": false,
  "link_to_drive": null,
  "error": "Error message",
  "fileUrl": "Original file URL",
  "fileName": "Attempted filename",
  "folderId": "Google Drive folder ID"
}
```

## Integration with openworksheet_enhanced

### Subworkflow Usage
This workflow is designed to be called from the openworksheet_enhanced workflow:

```json
{
  "parentId": "1wIIIS7mqlCrGnPIfzyov0SPmK4JhoEjn",
  "folderName": "{{ $json.folder }}",
  "fileUrl": "{{ $json.url }}",
  "fileName": null
}
```

### Response Handling
The openworksheet_enhanced workflow expects these specific fields:
- **status**: Always "done" (workflow completed)
- **downloaded**: true/false (file download success)
- **link_to_drive**: Google Drive view URL or null

## Key Features

### 1. Enhanced Filename Extraction
- **Smart URL parsing**: Extracts filename from URL path
- **URL decoding**: Handles encoded characters properly
- **Extension handling**: Ensures proper file extensions
- **Fallback naming**: Uses "downloaded_file" if extraction fails

### 2. Automatic Folder Management
- **Search existing folders**: Checks if folder already exists
- **Create if missing**: Automatically creates folders when needed
- **Unified folder handling**: Works with both existing and new folders

### 3. Robust File Download
- **Timeout protection**: 30-second timeout prevents hanging
- **Retry logic**: 2 automatic retries on failure
- **Error handling**: Continues workflow even if download fails
- **Binary validation**: Checks for actual file data

### 4. Comprehensive Error Handling
- **Download validation**: Checks for binary data presence
- **Upload validation**: Verifies file ID after upload
- **Graceful failures**: Returns structured error responses
- **Workflow continuation**: Never stops the parent workflow

### 5. Public Sharing
- **Automatic permissions**: Sets files to public read access
- **URL generation**: Creates both view and download URLs
- **Access control**: Ensures files are accessible via links

## Usage Examples

### Basic Usage
```json
{
  "parentId": "1wIIIS7mqlCrGnPIfzyov0SPmK4JhoEjn",
  "folderName": "AI & Content Generation",
  "fileUrl": "https://example.com/ai-tool.pdf",
  "fileName": null
}
```

### With Custom Filename
```json
{
  "parentId": "1wIIIS7mqlCrGnPIfzyov0SPmK4JhoEjn",
  "folderName": "Data Sync & ETL",
  "fileUrl": "https://api.example.com/data/export.csv",
  "fileName": "monthly_report.csv"
}
```

### Error Handling Example
```json
{
  "parentId": "1wIIIS7mqlCrGnPIfzyov0SPmK4JhoEjn",
  "folderName": "Monitoring & DevOps",
  "fileUrl": "https://broken-link.com/file.pdf",
  "fileName": null
}
```

## Node Details

### 1. Validate Input
- **Purpose**: Validates required parameters and extracts filename
- **Features**: Enhanced URL parsing, parameter validation
- **Error handling**: Throws descriptive errors for missing parameters

### 2. Find Folder
- **Purpose**: Searches for existing folder in parent directory
- **Query**: Uses Google Drive API query with proper escaping
- **Output**: Always returns data (empty if not found)

### 3. Folder Exists?
- **Purpose**: Conditional check for folder existence
- **Logic**: Checks if search returned any results
- **Routing**: Routes to existing or create folder paths

### 4. Use Existing Folder / Create Folder
- **Purpose**: Handles both existing and new folder scenarios
- **Existing**: Extracts folder ID from search results
- **New**: Creates folder with specified name in parent

### 5. Get Folder ID
- **Purpose**: Unifies folder ID from both paths
- **Logic**: Handles different response formats
- **Validation**: Ensures folder ID is available

### 6. Download File
- **Purpose**: Downloads file from provided URL
- **Features**: 30s timeout, 2 retries, binary output
- **Error handling**: Continues on failure with error flag

### 7. Check Download Success
- **Purpose**: Validates download success
- **Validation**: Checks for binary data and errors
- **Routing**: Returns error response or continues to upload

### 8. Prepare Upload
- **Purpose**: Prepares file for Google Drive upload
- **Features**: Extension handling, binary data copying
- **Validation**: Ensures all required data is present

### 9. Upload File
- **Purpose**: Uploads file to Google Drive
- **Target**: Specified folder with proper naming
- **Output**: Returns Google Drive file ID

### 10. Set Permissions
- **Purpose**: Sets public read permissions
- **Access**: Anyone with link can view
- **Security**: Read-only access for public files

### 11. Build Response
- **Purpose**: Creates final response format
- **Success**: Includes all URLs and metadata
- **Failure**: Returns structured error information

## Error Scenarios

### Download Failures
- **Network timeout**: Returns timeout error
- **Invalid URL**: Returns URL error
- **Server error**: Returns server error
- **No binary data**: Returns data error

### Upload Failures
- **Permission denied**: Returns permission error
- **Storage full**: Returns storage error
- **Invalid file**: Returns file format error

### Folder Issues
- **Parent not found**: Returns parent error
- **Permission denied**: Returns folder permission error
- **Name conflicts**: Handles duplicate names

## Performance Considerations

### Timeout Settings
- **Download timeout**: 30 seconds
- **Retry attempts**: 2 retries
- **Total max time**: ~90 seconds per file

### Resource Usage
- **Memory**: Minimal (streams binary data)
- **CPU**: Low (mostly I/O operations)
- **Network**: Depends on file size

### Optimization Features
- **Binary data copying**: Prevents data loss
- **Efficient folder search**: Single query
- **Error early return**: Stops processing on failure

## Troubleshooting

### Common Issues

#### Download Failures
```
Error: "No binary data received"
Solution: Check URL accessibility and file format
```

#### Folder Creation Issues
```
Error: "No folderId available"
Solution: Verify parentId permissions and validity
```

#### Upload Problems
```
Error: "No file ID from upload"
Solution: Check Google Drive permissions and storage
```

### Debug Information
- **File URL**: Always included in error responses
- **Folder ID**: Available for debugging
- **Error details**: Specific error messages provided

## Version History
- **v1.0.0**: Initial implementation optimized for openworksheet integration
- **v1.0.1**: Enhanced error handling and response format

## Related Workflows
- **openworksheet**: Original Excel file processing workflow
- **openworksheet_enhanced**: Enhanced Excel processing with automatic file download
- **GDrive_upload**: Base template workflow for Google Drive operations

### Integration Workflow Details
The GDrive_openworksheet_upload workflow is specifically designed for the openworksheet_enhanced automation:

1. **openworksheet_enhanced** processes Excel worksheets and identifies new items
2. **GDrive_openworksheet_upload** (this workflow) downloads files from URLs and stores them in Google Drive
3. **Data Table** is updated with download status and Google Drive links

This creates a seamless automation pipeline from Excel data to organized Google Drive storage with comprehensive error handling.

## Tags
- google-drive
- file-upload
- openworksheet
- automation
- subworkflow
- integration
- error-handling
- folder-management

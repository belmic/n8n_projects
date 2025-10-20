# ScreenNotes v.4.5

## Overview
Advanced document management workflow for ScreenNotes with AI-powered analysis, duplicate detection, and comprehensive data processing. This workflow provides intelligent document processing, automatic categorization, and AI-driven insights for screen notes and documentation.

## Project Details
- **ID**: proj_2w6rbnufy
- **Created**: 2025-10-20T22:06:58.553Z
- **Updated**: 2025-10-20T22:07:30.000Z
- **Status**: Synced
- **Author**: admin
- **Version**: 4.5.0
- **Workflow ID**: 5VQTBLRU5ZQEVOjN

## Workflow Information
- **Nodes**: 40 (Complete workflow with all processing stages)
- **Connections**: 37
- **Active**: Yes
- **Trigger Type**: Telegram Trigger
- **Execution Frequency**: On-demand (telegram-triggered)
- **Data Source**: Telegram messages with media
- **Data Destination**: Notion database
- **AI Integration**: OpenAI GPT-4o-mini
- **Complexity**: Advanced
- **Tags**: GDrive, OpenAI, Notion

## Workflow Architecture

The ScreenNotes v.4.5 workflow follows a sophisticated multi-stage processing pipeline with comprehensive configuration management:

### Core Processing Stages

#### 1. **Initialization & Configuration** (4 nodes)
- **Start** (Telegram Trigger): Receives messages with media from Telegram
- **init_config**: Comprehensive configuration management with field definitions, database structure, and AI prompts
- **code_search_db**: Builds Notion database search queries
- **notion_search_db**: Searches for existing Notion databases

#### 2. **Database Management** (6 nodes)
- **pick_db_by_name**: Selects appropriate Notion database with strict matching rules
- **compose_db_route_ctx**: Builds database context and routing logic
- **Switch**: Routes workflow based on /start command and database existence
- **build_db_create payload**: Creates new database payload when needed
- **notion_create_db**: Creates new Notion database
- **build_post_create_msg**: Generates confirmation messages

#### 3. **File Processing** (6 nodes)
- **extract_file_id**: Extracts file information from Telegram messages with priority handling
- **getFile**: Retrieves file metadata from Telegram API
- **build_tgURL**: Constructs Telegram file URLs
- **downloadFile**: Downloads files from Telegram servers
- **Crypto**: Generates SHA256 hash for file identification
- **Sticky Notes**: Visual organization and documentation

#### 4. **AI Analysis** (3 nodes)
- **build_dynamic_prompt**: Generates dynamic prompts based on configuration
- **analyze_image**: OpenAI GPT-4o-mini image analysis with structured output
- **parse_JSON**: Robust JSON extraction from AI responses

#### 5. **Data Enrichment** (3 nodes)
- **enrichment_router**: Routes data for Contact/Event enrichment
- **serpapi_search1**: SerpAPI integration for location/event data
- **url_generator**: Generates map URLs and event links

#### 6. **Google Drive Integration** (3 nodes)
- **gd_input**: Prepares data for GDrive sub-workflow
- **call_gdrive_flow**: Executes GDrive upload workflow
- **gd_output**: Processes GDrive results and merges data

#### 7. **Data Normalization** (1 node)
- **normalize_for_notion**: Comprehensive data normalization with type inference and field mapping

#### 8. **Notion Operations** (4 nodes)
- **check_for_many**: Checks for existing entries in Notion database
- **if_entry_exist**: Conditional logic for create vs update operations
- **build_create_payload**: Dynamic payload creation for new Notion pages
- **build_update_payload**: Dynamic payload creation for existing page updates
- **notion_create**: Executes Notion API operations

#### 9. **Response Generation** (2 nodes)
- **build_tg_message**: Generates Telegram response messages
- **msg_response**: Sends confirmation messages to Telegram

#### 10. **Error Handling** (2 nodes)
- **build_error_text**: Generates error messages
- **msg_error**: Sends error notifications

### Key Features

- **Dynamic Field Management**: Supports 40+ configurable fields with type-specific processing
- **Multi-Type Support**: Handles Product, Contact, Event, and Note classifications
- **Intelligent Routing**: Smart workflow routing based on command and database state
- **Data Enrichment**: Automatic map URL generation and event link discovery
- **Robust Error Handling**: Comprehensive error management and user feedback
- **File Processing**: Multi-format support with priority-based file selection
- **AI Integration**: Advanced image analysis with structured data extraction
- **Database Management**: Automatic database creation and field validation

### 1. **Configuration Management**
- **Simplified init_config**: Single source of truth for all field definitions
- **Dynamic Field Generation**: Auto-generates Notion properties, prompts, and validation
- **Easy Field Addition**: Add new fields by simply updating the FIELDS array

### 2. **Input Processing**
- **Telegram Trigger**: Receives messages with media attachments
- **File Extraction**: Extracts file IDs and metadata from Telegram updates
- **File Download**: Downloads files from Telegram servers
- **Crypto Hashing**: Generates unique identifiers for files

### 3. **AI Analysis**
- **Dynamic Prompt Building**: Constructs AI prompts from simplified init_config
- **OpenAI Analysis**: Analyzes screenshots using GPT-4 Vision
- **JSON Parsing**: Extracts structured data from AI responses

### 4. **Data Normalization**
- **Field Mapping**: Maps AI output to Notion database fields using DB_STRUCTURE
- **Data Validation**: Ensures data integrity using validFields validation
- **Type Conversion**: Converts data types for Notion compatibility

### 5. **Database Operations**
- **Duplicate Detection**: Checks for existing entries using UID
- **Create/Update Logic**: Creates new entries or updates existing ones using simplified payload builders
- **Notion Integration**: Syncs data with Notion database

### 6. **Response Generation**
- **Telegram Response**: Sends confirmation messages to users
- **Status Updates**: Provides real-time feedback on processing

### Node Details

#### 1. init_config (Code Node)
- **Type**: n8n-nodes-base.code
- **Purpose**: Single source of truth for workflow configuration
- **Key Features**:
  - Simplified field definitions in FIELDS array
  - Auto-generates Notion DB properties
  - Dynamic prompt generation for AI
  - Field validation and type mapping
- **Configuration**: Contains all workflow settings, database schema, and AI prompts

#### 2. Telegram Trigger
- **Type**: n8n-nodes-base.telegramTrigger
- **Purpose**: Receives messages with media attachments
- **Configuration**: 
  - Updates: message
  - Download: false
- **Expected Input**: Telegram messages with photos, documents, or videos

#### 3. extract_file_id (Code Node)
- **Type**: n8n-nodes-base.code
- **Purpose**: Extracts file metadata from Telegram updates
- **Output**: 
  - chat_id, file_id, caption, file_name
  - content_kind, has_media, token

#### 4. getFile (HTTP Request)
- **Type**: n8n-nodes-base.httpRequest
- **Purpose**: Gets file path from Telegram API
- **URL**: `https://api.telegram.org/bot{token}/getFile`

#### 5. build_tgURL (Code Node)
- **Type**: n8n-nodes-base.code
- **Purpose**: Builds direct file URL from Telegram file path
- **Output**: tg_file_url, screenshot_url, file_name, file_ext

#### 6. downloadFile (HTTP Request)
- **Type**: n8n-nodes-base.httpRequest
- **Purpose**: Downloads file from Telegram servers
- **Response Format**: File

#### 7. Crypto (Crypto Node)
- **Type**: n8n-nodes-base.crypto
- **Purpose**: Generates SHA256 hash for file identification
- **Output**: ImageUID (unique identifier)

#### 8. build_dynamic_prompt (Code Node)
- **Type**: n8n-nodes-base.code
- **Purpose**: Builds AI prompts from simplified init_config
- **Features**:
  - Dynamic field prompts
  - Type-specific guidance
  - Language policy enforcement

#### 9. analyze_image (OpenAI)
- **Type**: @n8n/n8n-nodes-langchain.openAi
- **Purpose**: Analyzes screenshots using GPT-4 Vision
- **Model**: gpt-4o-mini
- **Input**: Dynamic prompt + image URL

#### 10. parse_JSON (Code Node)
- **Type**: n8n-nodes-base.code
- **Purpose**: Robustly extracts JSON from AI responses
- **Features**: Handles malformed JSON, missing brackets, trailing commas

#### 11. normalize_for_notion (Code Node)
- **Type**: n8n-nodes-base.code
- **Purpose**: Normalizes AI output for Notion database
- **Features**:
  - Field mapping using DB_STRUCTURE
  - Type conversion and validation
  - UID generation and screenshot URL resolution

#### 12. Google Drive Integration
- **Sub-workflow**: GDrive_upload
- **Purpose**: Uploads files to Google Drive
- **Features**: Automatic folder organization by type

#### 13. check_for_many (Notion)
- **Type**: n8n-nodes-base.notion
- **Purpose**: Checks for existing entries using UID
- **Operation**: getAll with UID filter

#### 14. if_entry_exist (IF Node)
- **Type**: n8n-nodes-base.if
- **Purpose**: Determines create vs update path
- **Logic**: If entries found → update, else create

#### 15. build_create_payload (Code Node)
- **Type**: n8n-nodes-base.code
- **Purpose**: Builds Notion create page payload
- **Features**:
  - Uses simplified init_config structure
  - Field validation using validFields
  - Auto-generated fields handling

#### 16. build_update_payload (Code Node)
- **Type**: n8n-nodes-base.code
- **Purpose**: Builds Notion update page payload
- **Features**:
  - Read-only field protection
  - Conditional field updates
  - Image URL handling

#### 17. notion_create (HTTP Request)
- **Type**: n8n-nodes-base.httpRequest
- **Purpose**: Creates/updates Notion pages
- **Method**: POST/PATCH
- **URL**: Notion API endpoints

#### 18. build_tg_message (Code Node)
- **Type**: n8n-nodes-base.code
- **Purpose**: Builds Telegram response messages
- **Features**: Markdown formatting, action indicators, Notion links

#### 19. msg_response (Telegram)
- **Type**: n8n-nodes-base.telegram
- **Purpose**: Sends confirmation messages to users

## Database Schema

### Notion Database Properties
The ScreenNotes v.4.0 workflow uses a dynamic Notion database with the following field structure:

#### Core Fields (Always Present)
- **Title**: title - Main heading or summary
- **Type**: select - Classification (Note, Product, Contact, Event)
- **Category**: select - Subcategory (electronics, restaurant, etc.)
- **Tags**: multi_select - Keywords for organization
- **Summary**: rich_text - Brief description
- **Key facts**: rich_text - Actionable information
- **Source URL**: url - Original source link
- **Screenshot**: files - Image attachment
- **Captured at**: date - Timestamp (auto-generated)
- **Status**: select - Processing status (New, Processed)
- **Confidence**: number - AI confidence score (0-1)
- **Lang**: select - Language code (en, ru, uk, auto)
- **Channel**: select - Source channel (Telegram Bot)
- **UID**: rich_text - Unique identifier (auto-generated)

#### Product Fields (Type = "Product")
- **product_Price**: number - Numeric price
- **product_Currency**: select - Currency (USD, EUR, UAH)
- **product_Vendor**: rich_text - Store or brand name
- **product_StoreURL**: url - Product page link

#### Contact Fields (Type = "Contact")
- **contact_Email**: email - Email address
- **contact_Phone**: phone_number - Phone number
- **contact_Address**: rich_text - Postal address
- **contact_mapURL**: url - Map link
- **contact_Lat**: number - Latitude
- **contact_Lng**: number - Longitude
- **contact_LinkedIn**: url - LinkedIn profile
- **contact_Telegram**: url - Telegram handle
- **contact_Instagram**: url - Instagram profile

#### Event Fields (Type = "Event")
- **event_Date**: date - Event date range
- **event_DateStart**: date - Start date
- **event_DateEnd**: date - End date
- **event_Email**: email - Contact email
- **event_Phone**: phone_number - Contact phone
- **event_Adddress**: rich_text - Event location
- **event_AddressURL**: url - Location link
- **event_Price**: number - Event cost

#### Notes Fields (Type = "Note")
- **notes_Topic**: rich_text - Topic classification
- **notes_Source**: rich_text - Source reference

#### Technical Fields
- **Chat ID**: number - Telegram chat identifier

## API Usage

### Telegram Bot Integration
The ScreenNotes v.4.0 workflow is triggered via Telegram bot messages:

#### Bot Commands
- **Send any message with media** - Processes screenshots, documents, or videos
- **Supported media types**: Photos, documents, videos, animations, stickers
- **Automatic processing**: AI analysis, categorization, and Notion storage

#### Message Flow
1. **User sends media** to Telegram bot
2. **Bot extracts file** and downloads content
3. **AI analyzes** screenshot/document content
4. **Data is normalized** and stored in Notion
5. **Confirmation sent** back to user

#### Response Format
The bot sends formatted messages with:
- Action indicator (🆕 Created / ✏️ Updated)
- Note title and type
- Tags and summary
- Direct link to Notion page
- Processing status

### Database Management

#### Automatic Database Creation
- **Trigger**: Send `/start` command to bot
- **Action**: Creates Notion database if it doesn't exist
- **Configuration**: Uses init_config settings for database structure

#### Database Discovery
- **Search**: Bot searches for existing databases by name
- **Matching**: Uses strict name matching with optional parent page filtering
- **Fallback**: Creates new database if none found

## Features

### Core Features
- **Simplified Configuration**: Single init_config node manages all settings
- **Dynamic Field Management**: Easy addition of new fields with automatic generation
- **AI-Powered Analysis**: GPT-4 Vision analyzes screenshots and documents
- **Smart Categorization**: Automatic classification into Product, Contact, Event, or Note
- **Duplicate Prevention**: UID-based duplicate detection
- **Multi-Platform Integration**: Telegram, Notion, Google Drive, OpenAI
- **Real-time Processing**: Instant analysis and storage
- **Flexible Data Types**: Supports various field types and conditional fields

### Advanced Features
- **Type-Specific Fields**: Different fields based on content classification
- **Auto-Generated Fields**: Timestamps, UIDs, and channel information
- **Image Processing**: Screenshot analysis with confidence scoring
- **Multi-Language Support**: OCR language detection and preservation
- **Database Auto-Creation**: Automatic Notion database setup
- **Error Recovery**: Robust error handling and validation
- **Telegram Integration**: Native Telegram bot with rich responses

## Configuration

### Simplified init_config Structure
The workflow uses a simplified configuration approach where all settings are managed in a single `init_config` node:

#### Field Definition Format
```javascript
const FIELDS = [
  {
    name: "Field Name",
    type: "field_type", // title, select, multi_select, rich_text, etc.
    prompt: "AI prompt description",
    required: true, // optional
    alwaysShow: true, // optional
    showWhen: "Type === 'Product'", // optional condition
    options: ["Option1", "Option2"], // for select fields
    autoGenerated: true, // optional
    readOnly: true // optional
  }
];
```

#### Adding New Fields
To add a new field:
1. Add field definition to FIELDS array
2. Specify type and prompt
3. Set conditions if needed
4. Everything else is auto-generated

#### Auto-Generated Components
- **NOTION_DB_PROPERTIES**: Notion database schema
- **DB_STRUCTURE**: Field validation and type mapping
- **FIELDS**: AI prompt definitions
- **PER_TYPE**: Type-specific field groups
- **TYPE_OPTIONS**: Classification options
## Configuration Requirements

### Required Credentials
- **Telegram Bot Token**: For receiving messages and sending responses
- **Notion API Key**: For database operations and page management
- **OpenAI API Key**: For AI analysis and content processing
- **Google Drive API**: For file storage and organization

### Environment Variables
- **TELEGRAM_BOT_TOKEN**: Your Telegram bot token
- **NOTION_API_KEY**: Your Notion integration token
- **OPENAI_API_KEY**: Your OpenAI API key
- **GOOGLE_DRIVE_CREDENTIALS**: Google Drive service account credentials

### Workflow Settings
- **NOTION_DB_NAME**: Name of your Notion database
- **NOTION_PARENT_PAGE_ID**: Parent page ID for database creation
- **DRIVE_PARENT_ID**: Google Drive folder ID for file storage
- **DEFAULT_LANG**: Default language for processing

## Deployment Instructions

### Setup Steps
1. **Create Telegram Bot**: Use @BotFather to create a new bot
2. **Configure Notion**: Create integration and get API key
3. **Setup OpenAI**: Get API key from OpenAI platform
4. **Configure Google Drive**: Create service account and get credentials
5. **Deploy Workflow**: Import workflow JSON into n8n
6. **Configure Credentials**: Add all required API keys
7. **Test Bot**: Send test message to verify functionality

### Testing
- Send `/start` to create database
- Send screenshot to test processing
- Verify Notion database creation
- Check Google Drive file upload

## Version History

### v.4.5 (Current)
- **Date**: 2025-10-20
- **Changes**:
  - Updated from n8n workflow ID 5VQTBLRU5ZQEVOjN
  - Complete 40-node workflow with comprehensive processing pipeline
  - Enhanced Telegram integration with pin data and multi-format support
  - Advanced AI analysis with OpenAI GPT-4o-mini integration
  - Comprehensive data enrichment with SerpAPI integration
  - Dynamic field management with 40+ configurable fields
  - Intelligent routing and error handling
  - Google Drive integration with sub-workflow execution
  - Robust Notion database management with auto-creation
  - Improved project management integration
  - Updated project metadata and tags
  - Synced with git repository

### v.4.2 (Previous)
- **Date**: 2025-10-19
- **Changes**: 
  - Clean, stable version without enrichment features
  - Fixed validation errors and configuration issues
  - Improved workflow reliability
  - Streamlined architecture with 40 nodes
  - Enhanced Telegram integration
  - Better Notion database operations

### v.4.0 (Previous)
- **Simplified Configuration**: Single init_config node manages all settings
- **Dynamic Field Management**: Easy addition of new fields
- **Enhanced AI Integration**: GPT-4 Vision for image analysis
- **Improved Error Handling**: Robust validation and recovery
- **Telegram Bot Integration**: Native Telegram support
- **Notion Database**: Dynamic database creation and management

### v.3.6 (Previous)
- **Webhook-based**: REST API integration
- **Supabase Database**: PostgreSQL backend
- **Basic AI Analysis**: OpenAI text analysis
- **Manual Configuration**: Complex setup process

## Related Workflows
- **openworksheet**: Excel file processing workflow
- **openworksheet_enhanced**: Enhanced Excel processing with file management
- **GDrive_upload**: Google Drive file upload automation

## Support and Documentation
- **Repository**: https://github.com/belmic/n8n_projects
- **Documentation**: This README file
- **Issues**: Report issues via GitHub issues
- **Contact**: mic.belov@gmail.com

## License
This project is part of the n8n automation suite. Please refer to the main project license for usage terms.

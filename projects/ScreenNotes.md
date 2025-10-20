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

The ScreenNotes v.4.5 workflow follows a sophisticated multi-stage processing pipeline with comprehensive configuration management and advanced AI integration:

### Processing Flow Overview

The workflow operates through several interconnected stages, each handling specific aspects of document processing:

1. **Initialization & Database Setup**: Configures the workflow and ensures Notion database exists
2. **File Processing**: Downloads and processes media files from Telegram
3. **AI Analysis**: Analyzes screenshots using OpenAI GPT-4o-mini with structured output
4. **Data Enrichment**: Enhances data with external APIs (SerpAPI for locations/events)
5. **Google Drive Integration**: Uploads files to organized Google Drive folders
6. **Data Normalization**: Prepares data for Notion database with type inference
7. **Database Operations**: Creates or updates Notion pages with intelligent duplicate detection
8. **Response Generation**: Provides user feedback through Telegram messages
9. **Error Handling**: Manages errors and provides appropriate user notifications

### Key Features

- **Dynamic Field Management**: Supports 40+ configurable fields with type-specific processing
- **Multi-Type Support**: Handles Product, Contact, Event, and Note classifications with specialized fields
- **Intelligent Routing**: Smart workflow routing based on /start command and database existence
- **Data Enrichment**: Automatic map URL generation and event link discovery via SerpAPI
- **Robust Error Handling**: Comprehensive error management and user feedback
- **File Processing**: Multi-format support with priority-based file selection (photo > document > video > animation > sticker)
- **AI Integration**: Advanced image analysis with structured data extraction using GPT-4o-mini
- **Database Management**: Automatic database creation and field validation
- **Sub-workflow Integration**: Seamless Google Drive upload via dedicated sub-workflow

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

### Detailed Node Descriptions

#### 1. Start (Telegram Trigger)
- **Type**: n8n-nodes-base.telegramTrigger
- **Purpose**: Entry point for the workflow, receives messages with media attachments
- **Configuration**: 
  - Updates: message
  - Download: false
- **Expected Input**: Telegram messages with photos, documents, videos, animations, or stickers
- **Pin Data**: Contains sample Telegram message with photo data for testing

#### 2. init_config (Code Node)
- **Type**: n8n-nodes-base.code
- **Purpose**: Single source of truth for workflow configuration
- **Key Features**:
  - Simplified field definitions in FIELDS array (40+ fields)
  - Auto-generates Notion DB properties and schema
  - Dynamic prompt generation for AI analysis
  - Field validation and type mapping
  - Workflow settings (Telegram, Notion, GDrive, SerpAPI)
  - Type-specific field groups (Product, Contact, Event, Note)
- **Configuration**: Contains all workflow settings, database schema, AI prompts, and field definitions

#### 3. Database Management Nodes

##### code_search_db (Code Node)
- **Type**: n8n-nodes-base.code
- **Purpose**: Builds Notion database search queries
- **Features**: Dynamic query construction with filters and pagination

##### notion_search_db (HTTP Request)
- **Type**: n8n-nodes-base.httpRequest
- **Purpose**: Searches for existing Notion databases
- **URL**: `https://api.notion.com/v1/search`
- **Method**: POST
- **Headers**: Notion-Version, Authorization

##### pick_db_by_name (Code Node)
- **Type**: n8n-nodes-base.code
- **Purpose**: Selects appropriate Notion database with strict matching rules
- **Features**: 
  - Exact name matching with fallback to contains matching
  - Parent page validation
  - Database existence checking
- **Output**: found_db_id, found_db_url, db_exists, resolved_as

##### compose_db_route_ctx (Code Node)
- **Type**: n8n-nodes-base.code
- **Purpose**: Builds database context and routing logic
- **Features**: 
  - /start command detection
  - Database existence checking
  - Route index calculation for Switch node
- **Output**: database_id, database_url, db_exists, route context

##### Switch (Switch Node)
- **Type**: n8n-nodes-base.switch
- **Purpose**: Routes workflow based on /start command and database existence
- **Routes**:
  - START_HAS_DB: /start command with existing database
  - NO_START_NO_DB: No /start command, no database
  - START_NO_DB: /start command, no database (create new)
  - NO_START_HAS_DB: No /start command, existing database (process)

##### build_db_create payload (Code Node)
- **Type**: n8n-nodes-base.code
- **Purpose**: Creates new database payload when needed
- **Features**: 
  - Parent page ID validation
  - Database name validation
  - Property schema validation
- **Output**: body, meta (notionVersion, name, parentPageId)

##### notion_create_db (HTTP Request)
- **Type**: n8n-nodes-base.httpRequest
- **Purpose**: Creates new Notion database
- **URL**: `https://api.notion.com/v1/databases`
- **Method**: POST
- **Headers**: Notion-Version, Authorization, Content-Type

##### build_post_create_msg (Code Node)
- **Type**: n8n-nodes-base.code
- **Purpose**: Generates confirmation messages after database creation
- **Features**: 
  - Database details formatting
  - Inline keyboard with Notion link
  - Success confirmation message

#### 4. File Processing Nodes

##### extract_file_id (Code Node)
- **Type**: n8n-nodes-base.code
- **Purpose**: Extracts file information from Telegram messages with priority handling
- **Features**:
  - Priority-based file selection (largest photo → document → video → animation → sticker)
  - Chat ID extraction from various message types
  - File name generation with timestamps
  - Token retrieval from init_config
- **Output**: chat_id, file_id, caption, file_name, content_kind, has_media, token

##### getFile (HTTP Request)
- **Type**: n8n-nodes-base.httpRequest
- **Purpose**: Retrieves file metadata from Telegram API
- **URL**: `https://api.telegram.org/bot{token}/getFile`
- **Method**: POST
- **Body**: file_id parameter

##### build_tgURL (Code Node)
- **Type**: n8n-nodes-base.code
- **Purpose**: Constructs Telegram file URLs
- **Features**:
  - Direct file URL generation
  - File name and extension extraction
  - Error handling for missing paths/tokens
- **Output**: tg_file_url, screenshot_url, file_name, file_ext

##### downloadFile (HTTP Request)
- **Type**: n8n-nodes-base.httpRequest
- **Purpose**: Downloads files from Telegram servers
- **URL**: `https://api.telegram.org/file/bot{token}/{file_path}`
- **Response Format**: File
- **Output Property**: screenshot

##### Crypto (Crypto Node)
- **Type**: n8n-nodes-base.crypto
- **Purpose**: Generates SHA256 hash for file identification
- **Algorithm**: SHA256
- **Input**: Binary data from downloaded file
- **Output**: ImageUID (unique identifier)

#### 5. AI Analysis Nodes

##### build_dynamic_prompt (Code Node)
- **Type**: n8n-nodes-base.code
- **Purpose**: Generates dynamic prompts based on configuration
- **Features**:
  - Dynamic field prompts from init_config
  - Type-specific guidance for Product, Contact, Event, Note
  - Language policy enforcement
  - Output schema validation
- **Output**: prompt_text (structured AI prompt)

##### analyze_image (OpenAI)
- **Type**: @n8n/n8n-nodes-langchain.openAi
- **Purpose**: Analyzes screenshots using GPT-4o-mini with structured output
- **Model**: gpt-4o-mini
- **Features**:
  - Vision capabilities for image analysis
  - Structured JSON output requirement
  - Max tokens: 600
  - Detail: auto
- **Input**: Dynamic prompt + image URL from build_tgURL

##### parse_JSON (Code Node)
- **Type**: n8n-nodes-base.code
- **Purpose**: Robustly extracts JSON from AI responses
- **Features**: 
  - Handles malformed JSON, missing brackets, trailing commas
  - Content extraction from various OpenAI response formats
  - JSON sanitization and validation
  - Error reporting with raw content
- **Output**: Parsed JSON object or error details

#### 6. Data Enrichment Nodes

##### enrichment_router (Code Node)
- **Type**: n8n-nodes-base.code
- **Purpose**: Routes data for Contact/Event enrichment
- **Features**:
  - Type-based enrichment (Contact/Event only)
  - SerpAPI configuration generation
  - Search query construction
  - Enrichment need assessment
- **Output**: enrichment_needed, enrichment_query, enrichment_type, enrichment_config

##### serpapi_search1 (HTTP Request)
- **Type**: n8n-nodes-base.httpRequest
- **Purpose**: SerpAPI integration for location/event data
- **URL**: `https://serpapi.com/search`
- **Features**:
  - Google search with local results
  - Configurable parameters (country, language, num results)
  - Timeout handling (15 seconds)
- **Parameters**: api_key, q, engine, country, language, num, safe, tbm

##### url_generator (Code Node)
- **Type**: n8n-nodes-base.code
- **Purpose**: Generates map URLs and event links
- **Features**:
  - GPS coordinate extraction from SerpAPI results
  - Google Maps URL generation
  - Best match selection algorithm
  - Match score calculation
- **Output**: Enhanced data with map URLs and confidence scores

#### 7. Google Drive Integration Nodes

##### gd_input (Code Node)
- **Type**: n8n-nodes-base.code
- **Purpose**: Prepares data for GDrive sub-workflow
- **Features**:
  - Parent folder ID extraction
  - Folder name generation from Type field
  - File URL preparation
  - File name validation and extension handling
- **Output**: parentId, folderName, fileUrl, fileName

##### call_gdrive_flow (Execute Workflow)
- **Type**: n8n-nodes-base.executeWorkflow
- **Purpose**: Executes GDrive upload workflow
- **Sub-workflow**: GDrive_upload (Yxs70uuQ2IMHaXP9)
- **Features**:
  - Wait for sub-workflow completion
  - Input parameter mapping
  - Error handling

##### gd_output (Code Node)
- **Type**: n8n-nodes-base.code
- **Purpose**: Processes GDrive results and merges data
- **Features**:
  - File ID extraction from sub-workflow
  - Google Drive URL generation
  - Data merging with original normalized data
  - Error handling for failed uploads
- **Output**: Enhanced data with GDrive URLs and file IDs

#### 8. Data Normalization Node

##### normalize_for_notion (Code Node)
- **Type**: n8n-nodes-base.code
- **Purpose**: Comprehensive data normalization with type inference and field mapping
- **Features**:
  - Multi-source data merging (AI, GDrive, Telegram, SerpAPI)
  - Type inference for Notion field types
  - UID generation from Crypto node or fallback hash
  - Screenshot URL resolution (Telegram → GDrive → fallback)
  - Field validation using DB_STRUCTURE
  - Auto-generated fields (Captured at, Channel, UID)
- **Output**: Normalized data ready for Notion database

#### 9. Notion Operations Nodes

##### check_for_many (Notion)
- **Type**: n8n-nodes-base.notion
- **Purpose**: Checks for existing entries in Notion database using UID
- **Operation**: getAll with UID filter
- **Features**:
  - Duplicate detection using unique identifier
  - Always output data (even if no results)
  - Database ID from normalized data

##### if_entry_exist (IF Node)
- **Type**: n8n-nodes-base.if
- **Purpose**: Conditional logic for create vs update operations
- **Logic**: If entries found → update path, else create path
- **Condition**: Checks count of results from check_for_many

##### build_create_payload (Code Node)
- **Type**: n8n-nodes-base.code
- **Purpose**: Dynamic payload creation for new Notion pages
- **Features**:
  - Field validation using validFields from DB_STRUCTURE
  - Type-specific property formatting
  - Auto-generated fields handling
  - Required fields enforcement
  - Cover image handling
- **Output**: POST request payload for Notion API

##### build_update_payload (Code Node)
- **Type**: n8n-nodes-base.code
- **Purpose**: Dynamic payload creation for existing page updates
- **Features**:
  - Read-only field protection
  - Conditional field updates
  - Page ID extraction from upstream
  - Cover image updates
- **Output**: PATCH request payload for Notion API

##### notion_create (HTTP Request)
- **Type**: n8n-nodes-base.httpRequest
- **Purpose**: Executes Notion API operations (create/update)
- **Method**: Dynamic (POST/PATCH from payload)
- **URL**: Dynamic (from payload)
- **Headers**: Notion-Version, Authorization, Content-Type
- **Body**: Dynamic JSON from create/update payload

#### 10. Response Generation Nodes

##### build_tg_message (Code Node)
- **Type**: n8n-nodes-base.code
- **Purpose**: Generates Telegram response messages
- **Features**:
  - Markdown formatting with escape handling
  - Action indicators (✏️ Updated, 🆕 Created)
  - Notion page links
  - Tag formatting
  - Date range display
- **Output**: text, chat_id, notion_url, notion_page_id, action, tags, type, title

##### msg_response (Telegram)
- **Type**: n8n-nodes-base.telegram
- **Purpose**: Sends confirmation messages to users
- **Features**:
  - HTML parsing mode
  - Chat ID from message context
- **Input**: Formatted message from build_tg_message

#### 11. Error Handling Nodes

##### build_error_text (Code Node)
- **Type**: n8n-nodes-base.code
- **Purpose**: Generates error messages
- **Features**:
  - Context-aware error messages
  - Database connection status reporting
  - /start command guidance
  - HTML formatting
- **Output**: chat_id, text, parse_mode, disable_web_page_preview

##### msg_error (Telegram)
- **Type**: n8n-nodes-base.telegram
- **Purpose**: Sends error notifications
- **Features**:
  - HTML parsing mode
  - Web page preview disabled
- **Input**: Error message from build_error_text

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

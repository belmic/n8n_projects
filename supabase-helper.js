#!/usr/bin/env node

/**
 * Supabase Template Discovery Helper Script
 * 
 * This script helps populate and test the Supabase template discovery system
 * with sample data and provides utility functions for template management.
 */

const { createClient } = require('@supabase/supabase-js');

// Configuration - Update these with your Supabase credentials
const SUPABASE_URL = process.env.SUPABASE_URL || 'your-supabase-url';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'your-supabase-anon-key';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Sample template data for testing
 */
const sampleTemplates = [
  {
    template_id: 'slack_notification_basic',
    name: 'Slack Notification Workflow',
    description: 'Simple workflow to send notifications to Slack channels',
    author_name: 'John Doe',
    author_username: 'johndoe',
    author_url: 'https://n8n.io/user/johndoe',
    template_url: 'https://n8n.io/workflows/1234',
    complexity: 'simple',
    target_audience: ['marketers', 'developers'],
    max_setup_minutes: 15,
    required_services: ['slack'],
    node_count: 3,
    trigger_type: 'Webhook',
    execution_frequency: 'On-demand',
    data_source: 'External API',
    data_destination: 'Slack Channel',
    tags: ['slack', 'notification', 'webhook'],
    search_keywords: 'slack notification webhook api automation',
    category: 'communication',
    node_types: ['n8n-nodes-base.webhook', 'n8n-nodes-base.slack'],
    connection_count: 2,
    is_active: true,
    view_count: 150,
    usage_count: 25,
    rating: 4.2
  },
  {
    template_id: 'ai_content_generator',
    name: 'AI Content Generator',
    description: 'Advanced workflow using OpenAI to generate content and post to social media',
    author_name: 'Jane Smith',
    author_username: 'janesmith',
    author_url: 'https://n8n.io/user/janesmith',
    template_url: 'https://n8n.io/workflows/5678',
    complexity: 'advanced',
    target_audience: ['marketers'],
    max_setup_minutes: 60,
    required_services: ['openai', 'twitter', 'slack'],
    node_count: 8,
    trigger_type: 'Schedule Trigger',
    execution_frequency: 'Daily',
    data_source: 'OpenAI API',
    data_destination: 'Social Media Platforms',
    tags: ['ai', 'content-generation', 'social-media', 'openai'],
    search_keywords: 'ai content generation openai gpt social media automation',
    category: 'ai-automation',
    node_types: ['@n8n/n8n-nodes-langchain.lmChatOpenAi', 'n8n-nodes-base.twitter', 'n8n-nodes-base.slack'],
    connection_count: 7,
    is_active: true,
    view_count: 300,
    usage_count: 45,
    rating: 4.7
  },
  {
    template_id: 'data_sync_etl',
    name: 'Data Sync ETL Pipeline',
    description: 'Extract, Transform, Load pipeline for syncing data between systems',
    author_name: 'Mike Johnson',
    author_username: 'mikej',
    author_url: 'https://n8n.io/user/mikej',
    template_url: 'https://n8n.io/workflows/9012',
    complexity: 'intermediate',
    target_audience: ['developers', 'analysts'],
    max_setup_minutes: 30,
    required_services: ['google-sheets', 'postgresql'],
    node_count: 6,
    trigger_type: 'Schedule Trigger',
    execution_frequency: 'Hourly',
    data_source: 'Google Sheets',
    data_destination: 'PostgreSQL Database',
    tags: ['etl', 'data-sync', 'database', 'google-sheets'],
    search_keywords: 'etl data sync database postgresql google sheets automation',
    category: 'data-processing',
    node_types: ['n8n-nodes-base.googleSheets', 'n8n-nodes-base.postgres', 'n8n-nodes-base.splitInBatches'],
    connection_count: 5,
    is_active: true,
    view_count: 200,
    usage_count: 30,
    rating: 4.0
  }
];

/**
 * Sample openworksheet enhanced data
 */
const sampleOpenworksheetData = [
  {
    name: 'Slack Marketing Automation',
    description: 'Automated Slack notifications for marketing campaigns',
    url: 'https://n8n.io/workflows/slack-marketing',
    score: 8,
    folder: 'Social Media Automation',
    status: 'new',
    analyzed_features: ['slack-integration', 'notification-automation'],
    node_types_found: ['n8n-nodes-base.slack', 'n8n-nodes-base.webhook'],
    complexity_analysis: 'simple',
    setup_time_estimate: 15,
    target_audience: ['marketers'],
    required_services: ['slack']
  },
  {
    name: 'AI Content Creator',
    description: 'AI-powered content creation using OpenAI GPT',
    url: 'https://n8n.io/workflows/ai-content',
    score: 9,
    folder: 'AI & Content Generation',
    status: 'analyzed',
    analyzed_features: ['ai-integration', 'content-generation'],
    node_types_found: ['@n8n/n8n-nodes-langchain.lmChatOpenAi', 'n8n-nodes-base.httpRequest'],
    complexity_analysis: 'advanced',
    setup_time_estimate: 45,
    target_audience: ['marketers'],
    required_services: ['openai']
  }
];

/**
 * Populate templates table with sample data
 */
async function populateTemplates() {
  console.log('📝 Populating templates table...');
  
  try {
    const { data, error } = await supabase
      .from('templates')
      .insert(sampleTemplates);
    
    if (error) {
      console.error('❌ Error populating templates:', error);
      return false;
    }
    
    console.log('✅ Templates populated successfully');
    return true;
  } catch (err) {
    console.error('❌ Error:', err);
    return false;
  }
}

/**
 * Populate openworksheet_enhanced table with sample data
 */
async function populateOpenworksheetEnhanced() {
  console.log('📊 Populating openworksheet_enhanced table...');
  
  try {
    const { data, error } = await supabase
      .from('openworksheet_enhanced')
      .insert(sampleOpenworksheetData);
    
    if (error) {
      console.error('❌ Error populating openworksheet_enhanced:', error);
      return false;
    }
    
    console.log('✅ Openworksheet enhanced data populated successfully');
    return true;
  } catch (err) {
    console.error('❌ Error:', err);
    return false;
  }
}

/**
 * Test template discovery queries
 */
async function testTemplateDiscovery() {
  console.log('🔍 Testing template discovery queries...');
  
  try {
    // Test 1: Find simple templates for marketers
    console.log('\n📋 Test 1: Simple templates for marketers');
    const { data: simpleTemplates, error: error1 } = await supabase
      .from('templates')
      .select('*')
      .eq('complexity', 'simple')
      .contains('target_audience', ['marketers']);
    
    if (error1) {
      console.error('❌ Error:', error1);
    } else {
      console.log(`✅ Found ${simpleTemplates.length} simple templates for marketers`);
      simpleTemplates.forEach(t => console.log(`   - ${t.name} (${t.rating}⭐)`));
    }
    
    // Test 2: Find AI-related workflows
    console.log('\n🤖 Test 2: AI-related workflows');
    const { data: aiWorkflows, error: error2 } = await supabase
      .from('openworksheet_enhanced')
      .select('*')
      .contains('analyzed_features', ['ai-integration']);
    
    if (error2) {
      console.error('❌ Error:', error2);
    } else {
      console.log(`✅ Found ${aiWorkflows.length} AI-related workflows`);
      aiWorkflows.forEach(w => console.log(`   - ${w.name} (${w.complexity_analysis})`));
    }
    
    // Test 3: Full-text search
    console.log('\n🔎 Test 3: Full-text search for "slack automation"');
    const { data: searchResults, error: error3 } = await supabase
      .from('templates')
      .select('*')
      .textSearch('search_keywords', 'slack automation');
    
    if (error3) {
      console.error('❌ Error:', error3);
    } else {
      console.log(`✅ Found ${searchResults.length} templates matching "slack automation"`);
      searchResults.forEach(t => console.log(`   - ${t.name} (${t.rating}⭐)`));
    }
    
    return true;
  } catch (err) {
    console.error('❌ Error:', err);
    return false;
  }
}

/**
 * Get template statistics
 */
async function getTemplateStats() {
  console.log('📈 Getting template statistics...');
  
  try {
    const { data: templates, error: templatesError } = await supabase
      .from('templates')
      .select('complexity, target_audience, required_services');
    
    if (templatesError) {
      console.error('❌ Error getting templates:', templatesError);
      return false;
    }
    
    const { data: workflows, error: workflowsError } = await supabase
      .from('openworksheet_enhanced')
      .select('complexity_analysis, target_audience, required_services');
    
    if (workflowsError) {
      console.error('❌ Error getting workflows:', workflowsError);
      return false;
    }
    
    // Calculate statistics
    const complexityStats = {};
    const audienceStats = {};
    const serviceStats = {};
    
    [...templates, ...workflows].forEach(item => {
      const complexity = item.complexity || item.complexity_analysis;
      if (complexity) {
        complexityStats[complexity] = (complexityStats[complexity] || 0) + 1;
      }
      
      const audiences = item.target_audience || [];
      audiences.forEach(audience => {
        audienceStats[audience] = (audienceStats[audience] || 0) + 1;
      });
      
      const services = item.required_services || [];
      services.forEach(service => {
        serviceStats[service] = (serviceStats[service] || 0) + 1;
      });
    });
    
    console.log('\n📊 Statistics:');
    console.log('Complexity Distribution:', complexityStats);
    console.log('Target Audience Distribution:', audienceStats);
    console.log('Required Services Distribution:', serviceStats);
    
    return true;
  } catch (err) {
    console.error('❌ Error:', err);
    return false;
  }
}

/**
 * Clear all test data
 */
async function clearTestData() {
  console.log('🧹 Clearing test data...');
  
  try {
    // Clear templates
    const { error: templatesError } = await supabase
      .from('templates')
      .delete()
      .in('template_id', sampleTemplates.map(t => t.template_id));
    
    if (templatesError) {
      console.error('❌ Error clearing templates:', templatesError);
    } else {
      console.log('✅ Templates cleared');
    }
    
    // Clear openworksheet_enhanced
    const { error: workflowsError } = await supabase
      .from('openworksheet_enhanced')
      .delete()
      .in('name', sampleOpenworksheetData.map(w => w.name));
    
    if (workflowsError) {
      console.error('❌ Error clearing workflows:', workflowsError);
    } else {
      console.log('✅ Workflows cleared');
    }
    
    return true;
  } catch (err) {
    console.error('❌ Error:', err);
    return false;
  }
}

/**
 * Main function
 */
async function main() {
  const command = process.argv[2];
  
  console.log('🚀 Supabase Template Discovery Helper');
  console.log('=====================================\n');
  
  switch (command) {
    case 'populate':
      await populateTemplates();
      await populateOpenworksheetEnhanced();
      break;
      
    case 'test':
      await testTemplateDiscovery();
      await getTemplateStats();
      break;
      
    case 'clear':
      await clearTestData();
      break;
      
    case 'all':
      await populateTemplates();
      await populateOpenworksheetEnhanced();
      await testTemplateDiscovery();
      await getTemplateStats();
      break;
      
    default:
      console.log('Usage: node supabase-helper.js <command>');
      console.log('');
      console.log('Commands:');
      console.log('  populate  - Populate tables with sample data');
      console.log('  test      - Test template discovery queries');
      console.log('  clear     - Clear test data');
      console.log('  all       - Run all operations');
      console.log('');
      console.log('Environment Variables:');
      console.log('  SUPABASE_URL      - Your Supabase project URL');
      console.log('  SUPABASE_ANON_KEY - Your Supabase anonymous key');
      break;
  }
}

// Run the script
if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  populateTemplates,
  populateOpenworksheetEnhanced,
  testTemplateDiscovery,
  getTemplateStats,
  clearTestData
};

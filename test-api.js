#!/usr/bin/env node
/**
 * Quick test script to verify GHL API connection
 */

const axios = require('axios');
require('dotenv').config();

const API_KEY = process.env.GHL_API_KEY;
const LOCATION_ID = process.env.GHL_LOCATION_ID;
const BASE_URL = process.env.GHL_BASE_URL || 'https://services.leadconnectorhq.com';

console.log('Testing GHL API Connection...');
console.log('='.repeat(50));
console.log('API Key:', API_KEY ? API_KEY.substring(0, 10) + '...' : 'NOT SET');
console.log('Location ID:', LOCATION_ID || 'NOT SET');
console.log('Base URL:', BASE_URL);
console.log('='.repeat(50));

async function testAPI() {
  if (!API_KEY || !LOCATION_ID) {
    console.error('ERROR: Missing required environment variables!');
    console.error('Please set GHL_API_KEY and GHL_LOCATION_ID');
    return;
  }

  try {
    // Test 1: Get Location Details
    console.log('\n1. Testing Location Access...');
    const locationResponse = await axios.get(
      `${BASE_URL}/locations/${LOCATION_ID}`,
      {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Version': '2021-07-28',
          'Content-Type': 'application/json'
        }
      }
    );
    console.log('✅ Location found:', locationResponse.data.location?.name || locationResponse.data.name);

    // Test 2: Try to create a test contact
    console.log('\n2. Testing Contact Creation...');
    const testContact = {
      locationId: LOCATION_ID,
      firstName: 'Test',
      lastName: 'MCP-' + Date.now(),
      email: `test-mcp-${Date.now()}@example.com`,
      phone: '+1' + Math.floor(Math.random() * 9000000000 + 1000000000),
      tags: ['mcp-test'],
      source: 'MCP Test Script'
    };

    console.log('Creating contact:', JSON.stringify(testContact, null, 2));

    const contactResponse = await axios.post(
      `${BASE_URL}/contacts/`,
      testContact,
      {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Version': '2021-07-28',
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('✅ Contact created successfully!');
    console.log('Contact ID:', contactResponse.data.contact?.id || contactResponse.data.id);
    console.log('Full response:', JSON.stringify(contactResponse.data, null, 2));

    // Test 3: Search for the created contact
    console.log('\n3. Searching for created contact...');
    const searchResponse = await axios.get(
      `${BASE_URL}/contacts/`,
      {
        params: {
          locationId: LOCATION_ID,
          email: testContact.email
        },
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Version': '2021-07-28'
        }
      }
    );

    console.log('✅ Found', searchResponse.data.contacts?.length || 0, 'contacts');
    if (searchResponse.data.contacts?.length > 0) {
      console.log('Contact verified:', searchResponse.data.contacts[0].email);
    }

  } catch (error) {
    console.error('\n❌ API Test Failed!');
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Response:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

testAPI();

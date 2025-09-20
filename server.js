const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'GHL MCP Server Running' });
});

// SSE endpoint for ElevenLabs
app.get('/sse', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*'
  });

  // Send capabilities
  const capabilities = {
    type: 'capabilities',
    version: '1.0',
    tools: [
      {
        name: 'search_contacts',
        description: 'Search for contacts',
        parameters: {
          phone: { type: 'string', required: false },
          email: { type: 'string', required: false }
        }
      },
      {
        name: 'create_appointment',
        description: 'Create appointment',
        parameters: {
          calendarId: { type: 'string', required: true },
          contactId: { type: 'string', required: true },
          startTime: { type: 'string', required: true }
        }
      }
    ]
  };

  res.write(`data: ${JSON.stringify(capabilities)}\n\n`);

  // Keep alive
  const interval = setInterval(() => {
    res.write(': ping\n\n');
  }, 30000);

  req.on('close', () => clearInterval(interval));
});

// Tool execution
app.post('/execute', async (req, res) => {
  const { tool, parameters } = req.body;
  
  try {
    // Basic implementation - expand as needed
    const headers = {
      'Authorization': `Bearer ${process.env.GHL_API_KEY}`,
      'Version': '2021-07-28'
    };

    const baseURL = process.env.GHL_BASE_URL;
    const locationId = process.env.GHL_LOCATION_ID;

    let result = {};
    
    if (tool === 'search_contacts') {
      const url = `${baseURL}/contacts/v1/contacts/search/duplicate`;
      const response = await axios.get(url, {
        headers,
        params: {
          locationId,
          number: parameters.phone
        }
      });
      result = response.data;
    }
    
    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/sse-simple', (req, res) => {
  console.log('[SSE] New connection from ElevenLabs');
  
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*'
  });

  // Send tools in ElevenLabs format
  const message = {
    tools: [
      {
        name: 'search_contacts',
        description: 'Search for contacts by phone',
        parameters: {
          type: 'object',
          properties: {
            phone: { type: 'string', description: 'Phone number' }
          }
        }
      },
      {
        name: 'get_free_slots',
        description: 'Get available appointment slots',
        parameters: {
          type: 'object',
          properties: {
            calendarId: { type: 'string', description: 'Calendar ID' },
            startDate: { type: 'string', description: 'Start date' },
            endDate: { type: 'string', description: 'End date' }
          }
        }
      },
      {
        name: 'create_appointment',
        description: 'Book an appointment',
        parameters: {
          type: 'object',
          properties: {
            calendarId: { type: 'string', description: 'Calendar ID' },
            contactId: { type: 'string', description: 'Contact ID' },
            startTime: { type: 'string', description: 'Start time ISO format' }
          }
        }
      }
    ]
  };

  // Send as SSE event
  res.write(`event: tools\n`);
  res.write(`data: ${JSON.stringify(message)}\n\n`);

  // Keep alive
  const interval = setInterval(() => {
    res.write(': keepalive\n\n');
  }, 30000);

  req.on('close', () => {
    console.log('[SSE] Connection closed');
    clearInterval(interval);
  });
});

// Tool execution endpoint
app.post('/execute', async (req, res) => {
  const { tool, parameters } = req.body;
  console.log('[Execute] Tool:', tool, 'Params:', parameters);
  
  // Add your GHL API calls here
  res.json({ success: true, result: 'Tool executed' });
});

app.get('/', (req, res) => {
  res.json({ status: 'SSE Simple Server Running' });
});

app.listen(PORT, () => {
  console.log(`SSE Simple Server on port ${PORT}`);
});

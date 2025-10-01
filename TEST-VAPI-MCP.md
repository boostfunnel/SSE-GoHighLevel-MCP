# 🔍 Test Vapi MCP Connection

## Step-by-Step Debugging

### Test 1: Health Check ✅
```bash
curl https://gohighlevel-mcp-vapi.up.railway.app/health
```

**Expected:** Should show `"server": "vapi-ghl-mcp-server"`

### Test 2: MCP Initialize Endpoint
```bash
curl -X POST https://gohighlevel-mcp-vapi.up.railway.app/mcp/initialize \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "initialize",
    "params": {
      "protocolVersion": "2024-11-05",
      "capabilities": {},
      "clientInfo": {
        "name": "vapi",
        "version": "1.0.0"
      }
    }
  }'
```

**Expected Response:**
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "protocolVersion": "2024-11-05",
    "capabilities": {
      "tools": {}
    },
    "serverInfo": {
      "name": "vapi-ghl-mcp-server",
      "version": "1.0.0"
    }
  }
}
```

### Test 3: MCP Tools List
```bash
curl -X POST https://gohighlevel-mcp-vapi.up.railway.app/mcp/tools/list \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 2,
    "method": "tools/list"
  }'
```

**Expected:** Should return 221 tools

### Test 4: Test a Simple Tool Call
```bash
curl -X POST https://gohighlevel-mcp-vapi.up.railway.app/mcp/tools/call \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 3,
    "method": "tools/call",
    "params": {
      "name": "search_contacts",
      "arguments": {
        "query": "test",
        "limit": 1
      }
    }
  }'
```

## Common Issues

### Issue 1: Port Mismatch
Railway might be using a different PORT than 8001.

**Fix:** Ensure server uses Railway's PORT env var (already done in code)

### Issue 2: CORS Headers
Vapi needs proper CORS headers.

**Fix:** Already configured in vapi-mcp-server.ts

### Issue 3: Wrong URL in Vapi
Make sure Vapi is configured with the ROOT URL.

**Correct:**
```json
{
  "server": {
    "url": "https://gohighlevel-mcp-vapi.up.railway.app"
  }
}
```

**Wrong:**
```json
{
  "server": {
    "url": "https://gohighlevel-mcp-vapi.up.railway.app/mcp"
  }
}
```

### Issue 4: Protocol Mismatch
Vapi expects Streamable HTTP by default.

**Check:** Make sure you're NOT setting `"protocol": "sse"` in Vapi config

## Run These Tests

Please run Test 1, 2, and 3 and share the results!


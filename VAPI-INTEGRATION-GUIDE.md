# 🎤 Vapi AI Integration Guide - GoHighLevel MCP Server

This guide shows you how to integrate the GoHighLevel MCP Server with Vapi AI using the **Streamable HTTP** protocol.

## 🔧 **Why a Separate Server?**

Vapi uses **Streamable HTTP** protocol by default, not SSE (Server-Sent Events). The original `http-server.ts` uses SSE which causes 500 errors in Vapi. The new `vapi-mcp-server.ts` is specifically designed for Vapi compatibility.

## 📋 **Prerequisites**

- Active GoHighLevel account with API access
- Vapi AI account 
- Railway, Vercel, or similar deployment platform
- Your GHL Location ID and API Key

## 🚀 **Step 1: Deploy the Vapi MCP Server**

### Option A: Railway Deployment (Recommended)

1. **Fork/Clone this repository**
2. **Connect to Railway**
3. **Set Environment Variables:**
   ```env
   GHL_API_KEY=your_ghl_api_key_here
   GHL_LOCATION_ID=your_location_id_here
   GHL_BASE_URL=https://services.leadconnectorhq.com
   VAPI_MCP_PORT=8001
   ```

4. **Set Start Command:**
   ```
   npm run start:vapi
   ```

5. **Deploy and Get URL:**
   - Railway will provide a URL like: `https://your-app.up.railway.app`
   - Test health: `https://your-app.up.railway.app/health`

### Option B: Vercel Deployment

1. **Deploy to Vercel**
2. **Configure Build Settings:**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

3. **Add Environment Variables** (same as Railway)
4. **Create `vercel.json`:**
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "dist/vapi-mcp-server.js",
         "use": "@vercel/node"
       }
     ],
     "routes": [
       {
         "src": "/(.*)",
         "dest": "dist/vapi-mcp-server.js"
       }
     ]
   }
   ```

## 🎯 **Step 2: Configure Vapi Dashboard**

### Create MCP Tool

1. **Go to Vapi Dashboard** → **Tools**
2. **Click "Create Tool"**
3. **Select "MCP" from options**
4. **Configure the tool:**

#### **Tool Configuration:**

```json
{
  "type": "mcp",
  "function": {
    "name": "ghlMcpTools"
  },
  "server": {
    "url": "https://your-app.up.railway.app"
  }
}
```

**Important Notes:**
- ✅ **Use HTTP URL** (not HTTPS if testing locally)  
- ✅ **No `/mcp` suffix** in serverUrl (Vapi handles routing)
- ✅ **Default protocol** is "shttp" (Streamable HTTP) - perfect!

### Advanced Configuration (Optional)

If you need custom headers or SSE fallback:

```json
{
  "type": "mcp",
  "function": {
    "name": "ghlMcpTools"
  },
  "server": {
    "url": "https://your-app.up.railway.app",
    "headers": {
      "Authorization": "Bearer your-token",
      "X-Custom-Header": "your-value"
    }
  },
  "metadata": {
    "protocol": "shttp"
  }
}
```

## 🎤 **Step 3: Add to Assistant**

1. **Go to Vapi Dashboard** → **Assistants**
2. **Select your assistant**
3. **Go to Tools tab**
4. **Add your MCP tool from dropdown**
5. **Click "Publish"**

### Sample Assistant Configuration

```json
{
  "model": {
    "provider": "openai",
    "model": "gpt-4o",
    "messages": [
      {
        "role": "system",
        "content": "You are a helpful sales assistant with access to GoHighLevel CRM tools. You can help with contacts, appointments, conversations, and more.\n\nAvailable tools include:\n- Contact management (create, search, update contacts)\n- Calendar booking (get free slots, create appointments)\n- Verification (email, SMS, WhatsApp)\n- Conversations (send SMS/email)\n- And 200+ more GoHighLevel tools\n\nAlways be professional and helpful when using these tools."
      }
    ],
    "tools": [
      {
        "type": "mcp",
        "function": {
          "name": "ghlMcpTools"
        },
        "server": {
          "url": "https://your-app.up.railway.app"
        }
      }
    ]
  }
}
```

## 🔍 **Step 4: Test the Integration**

### 1. Health Check
```bash
curl https://your-app.up.railway.app/health
```

**Expected Response:**
```json
{
  "status": "healthy",
  "server": "vapi-ghl-mcp-server",
  "protocol": "streamable-http",
  "tools": {
    "total": 221
  },
  "ghl": {
    "connected": true,
    "locationId": "your_location_id"
  }
}
```

### 2. Tools List Test
```bash
curl -X POST https://your-app.up.railway.app/mcp/tools/list \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc": "2.0", "id": 1, "method": "tools/list"}'
```

### 3. Test with Vapi Assistant
Try these commands with your assistant:
- "Search for a contact named John"
- "Create a new contact with email test@example.com"
- "Get available appointment slots for tomorrow"

## 🛠️ **Troubleshooting**

### Common Issues

#### ❌ **500 Error - Protocol Mismatch**
**Problem:** Using SSE server with Vapi  
**Solution:** Use the new `vapi-mcp-server.ts` (this guide)

#### ❌ **No Tools Found**
**Problem:** Server not responding to tool list requests  
**Solution:** Check `/mcp/tools/list` endpoint directly

#### ❌ **Authentication Failed**
**Problem:** Invalid GHL API credentials  
**Solution:** Verify `GHL_API_KEY` and `GHL_LOCATION_ID`

### Debug Endpoints

- **Health:** `/health`
- **Server Info:** `/`  
- **Tools List:** `/mcp/tools/list`
- **Debug:** `/debug`

### Environment Variables

```env
# Required
GHL_API_KEY=your_api_key
GHL_LOCATION_ID=your_location_id

# Optional
GHL_BASE_URL=https://services.leadconnectorhq.com
VAPI_MCP_PORT=8001
PORT=8001
```

## 📚 **Available Tools (221 Total)**

The MCP server provides access to all GoHighLevel tools:

### 🏷️ **Core Tools:**
- **Contacts:** Create, search, update, verify (email/SMS/WhatsApp)
- **Calendar:** Get slots, book appointments, manage calendars  
- **Conversations:** Send SMS/email, manage conversations
- **Opportunities:** CRM pipeline management
- **Workflows:** Trigger and manage automation

### 📈 **Advanced Tools:**
- **Social Media:** Post management and scheduling
- **E-commerce:** Products, orders, inventory
- **Surveys:** Form submissions and responses
- **Media:** File upload and management
- **Custom Objects:** Custom data structures

## 🔄 **Local Development**

For local testing:

```bash
# Install dependencies
npm install

# Start Vapi server in development
npm run dev:vapi

# Test locally
curl http://localhost:8001/health
```

## 🎯 **Next Steps**

1. ✅ **Deploy server** and get your URL
2. ✅ **Configure Vapi MCP tool** with serverUrl  
3. ✅ **Add to assistant** and publish
4. ✅ **Test basic functionality**
5. 🚀 **Build your voice workflows!**

## 📞 **Support**

- **Server Issues:** Check `/health` and `/debug` endpoints
- **Tool Errors:** Review server logs for specific error messages  
- **Vapi Integration:** Refer to [Vapi MCP Documentation](https://docs.vapi.ai/mcp)

**🎉 Your GoHighLevel tools are now available in Vapi AI!**

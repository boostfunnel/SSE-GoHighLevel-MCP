# ✅ Vapi MCP Server - Quick Start

## 🎉 **Issue Resolved!**

Your **500 error** was caused by protocol mismatch:
- ❌ **Old:** SSE (Server-Sent Events) - deprecated in Vapi
- ✅ **New:** Streamable HTTP - Vapi's default protocol

## 📦 **What Was Created**

### 1. **New Vapi-Compatible Server** 
`src/vapi-mcp-server.ts` - Built specifically for Vapi AI using Streamable HTTP protocol

### 2. **New NPM Scripts**
```bash
npm run dev:vapi      # Development mode
npm run start:vapi    # Production mode
```

### 3. **Complete Documentation**
`VAPI-INTEGRATION-GUIDE.md` - Full step-by-step setup guide

## 🚀 **Deploy Now (3 Steps)**

### **Step 1: Deploy to Railway**

1. **Push to GitHub** (if not already):
   ```bash
   cd "C:\Cursor Projects\SSE-GoHighLevel-MCP-main\SSE-GoHighLevel-MCP"
   git add .
   git commit -m "Add Vapi MCP server"
   git push
   ```

2. **Connect to Railway:**
   - Go to [Railway.app](https://railway.app)
   - Click "New Project" → "Deploy from GitHub repo"
   - Select this repository

3. **Configure Environment Variables:**
   ```env
   GHL_API_KEY=your_ghl_api_key
   GHL_LOCATION_ID=your_location_id
   VAPI_MCP_PORT=8001
   ```

4. **Set Start Command:**
   ```
   npm run start:vapi
   ```

5. **Deploy!** Railway will give you a URL like:
   ```
   https://your-app.up.railway.app
   ```

### **Step 2: Configure Vapi Dashboard**

1. **Go to:** [Vapi Dashboard](https://dashboard.vapi.ai) → **Tools** → **Create Tool**

2. **Select:** MCP

3. **Configure:**
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

4. **Save the tool**

### **Step 3: Add to Assistant**

1. **Go to:** Assistants → Select your assistant → **Tools** tab
2. **Add** your MCP tool from dropdown
3. **Click Publish**

## ✅ **Test It Works**

### 1. Health Check
```bash
curl https://your-app.up.railway.app/health
```

**Should return:**
```json
{
  "status": "healthy",
  "protocol": "streamable-http",
  "tools": { "total": 221 }
}
```

### 2. Test with Assistant
Try saying:
- "Search for a contact named John"
- "Get available appointment slots"
- "Create a new contact"

## 🔧 **Server Endpoints**

- `/health` - Health check
- `/` - Server info  
- `/mcp/initialize` - MCP initialization
- `/mcp/tools/list` - List all 221 tools
- `/mcp/tools/call` - Execute tool calls
- `/debug` - Debug info (for troubleshooting)

## 📋 **Environment Variables**

```env
# Required
GHL_API_KEY=your_api_key_here
GHL_LOCATION_ID=your_location_id_here

# Optional  
GHL_BASE_URL=https://services.leadconnectorhq.com
VAPI_MCP_PORT=8001
PORT=8001
```

## 🎯 **Key Differences from SSE Server**

| Feature | SSE Server (Old) | Vapi Server (New) |
|---------|------------------|-------------------|
| Protocol | Server-Sent Events | Streamable HTTP |
| Endpoints | `/sse`, `/elevenlabs` | `/mcp/*` |
| Port | 8000 | 8001 |
| Vapi Compatible | ❌ No (500 error) | ✅ Yes |

## 🛠️ **Troubleshooting**

### **Still getting 500 error?**
- ✅ Make sure you're using the NEW server URL
- ✅ Check environment variables are set
- ✅ Test `/health` endpoint directly

### **No tools appearing?**
- ✅ Check `/mcp/tools/list` returns tools
- ✅ Verify GHL credentials are valid

### **Tools not executing?**
- ✅ Check Railway logs for errors
- ✅ Verify tool parameters match schema

## 📚 **Documentation**

- **Full Guide:** `VAPI-INTEGRATION-GUIDE.md`
- **Vapi MCP Docs:** https://docs.vapi.ai/mcp
- **Railway Docs:** https://docs.railway.app

## 🎉 **You're Ready!**

Your GoHighLevel MCP server is now **fully compatible with Vapi AI** using the Streamable HTTP protocol.

**Next:** Deploy to Railway and configure your Vapi assistant! 🚀



# 🎯 Exact Vapi Configuration

## ✅ Your Server Status
```
✅ Server running: vapi-ghl-mcp-server
✅ Protocol: Streamable HTTP
✅ Port: 8001 (Railway auto-maps to HTTPS)
✅ Tools: 221 loaded
✅ GHL API: Connected
```

## 📋 **Exact Vapi Dashboard Configuration**

### Step 1: Create MCP Tool in Vapi

Go to: **Vapi Dashboard** → **Tools** → **Create Tool** → **MCP**

### Step 2: Tool Configuration

**Tool Name:** `GoHighLevel MCP`

**Tool Description:**
```
Access to 221 GoHighLevel CRM tools including contacts, calendar, conversations, appointments, verification, and more.
```

### Step 3: Server Configuration (CRITICAL)

**Use EXACTLY this JSON:**

```json
{
  "type": "mcp",
  "function": {
    "name": "gohighlevel_mcp"
  },
  "server": {
    "url": "https://gohighlevel-mcp-vapi.up.railway.app"
  }
}
```

**IMPORTANT:**
- ✅ Use ROOT URL (no `/mcp` at the end)
- ✅ Use `https://` (Railway provides SSL)
- ✅ NO `protocol` field (defaults to "shttp" - Streamable HTTP)
- ✅ NO `headers` field (unless you need auth)

### Step 4: Verify Configuration

After saving, the tool configuration should look like this in Vapi:

```json
{
  "type": "mcp",
  "function": {
    "name": "gohighlevel_mcp"
  },
  "server": {
    "url": "https://gohighlevel-mcp-vapi.up.railway.app"
  }
}
```

## 🎤 **Add to Your Assistant**

### Step 1: Go to Assistant Configuration

**Vapi Dashboard** → **Assistants** → **Your Assistant** → **Tools Tab**

### Step 2: Add the MCP Tool

1. Click **Add Tool**
2. Select **GoHighLevel MCP** from dropdown
3. Click **Save** or **Publish**

### Step 3: Update System Prompt (Recommended)

Add this to your assistant's system message:

```
You have access to GoHighLevel CRM tools through MCP. Available tools include:

**Contact Management:**
- create_contact, search_contacts, get_contact, update_contact
- upsert_contact (create or update)
- add_contact_tags, remove_contact_tags

**Verification:**
- start_email_verification, start_sms_verification, start_whatsapp_verification
- verify_code, resend_verification_code

**Calendar & Appointments:**
- get_free_slots, create_appointment, get_appointment
- update_appointment, delete_appointment
- get_contact_appointments

**Conversations:**
- send_sms, send_email
- search_conversations, get_conversation

**And 200+ more tools for CRM management.**

Always use tools when asked to perform CRM actions. Be professional and helpful.
```

## 🧪 **Test the Connection**

### Test 1: In Vapi Dashboard

After adding the tool, Vapi should show:
- ✅ Tool Status: **Active** or **Connected**
- ✅ Available Tools: **221**

### Test 2: Test Call

Make a test call and say:
```
"Search for a contact named John"
```

The assistant should:
1. Recognize it needs to use the `search_contacts` tool
2. Call the MCP server
3. Return results

## 🔧 **If Still Not Working**

### Check 1: Vapi Tool Status

In Vapi Dashboard, check if the MCP tool shows:
- ❌ **Error** or **Failed to connect** → Configuration issue
- ✅ **Active** or **Connected** → Working correctly

### Check 2: Railway Logs

While testing in Vapi, check Railway logs for:
```
[Vapi MCP] POST message received
[Vapi MCP] Tools list request received
[Vapi MCP] Tool call: search_contacts
```

### Check 3: Server Endpoints

Test manually:
```bash
# Health check (should work)
curl https://gohighlevel-mcp-vapi.up.railway.app/health

# MCP initialize (should return JSON)
curl -X POST https://gohighlevel-mcp-vapi.up.railway.app/mcp/initialize \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05"}}'

# MCP tools list (should return 221 tools)
curl -X POST https://gohighlevel-mcp-vapi.up.railway.app/mcp/tools/list \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":2,"method":"tools/list"}'
```

## 🎯 **Expected Behavior**

When working correctly:

1. **In Vapi Dashboard:** Tool shows as "Connected" with 221 tools
2. **During Calls:** Assistant can call any of the 221 tools
3. **In Railway Logs:** You see MCP requests coming from Vapi
4. **Response Time:** Tool calls return in 1-3 seconds

## 🆘 **Share This If Still Failing**

If it's still not working, share:
1. Screenshot of your Vapi MCP tool configuration
2. Screenshot of the error message in Vapi
3. Railway logs during a test call

---

**Most common issue:** URL has `/mcp` at the end (remove it!)
**Second most common:** Using `"protocol": "sse"` (remove that field!)


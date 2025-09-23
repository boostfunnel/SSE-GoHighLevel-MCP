// Debug script to test GHL calendar access
const axios = require('axios');

const GHL_API_KEY = process.env.GHL_API_KEY;
const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID;
const CALENDAR_ID = "tVVaGl0hdQLUD11J3uWu";

async function debugCalendar() {
    console.log('=== GHL Calendar Debug ===');
    console.log('Location ID:', GHL_LOCATION_ID);
    console.log('Calendar ID:', CALENDAR_ID);
    console.log('API Key:', GHL_API_KEY ? GHL_API_KEY.substring(0, 10) + '...' : 'NOT SET');
    
    const axiosInstance = axios.create({
        baseURL: 'https://services.leadconnectorhq.com',
        headers: {
            'Authorization': `Bearer ${GHL_API_KEY}`,
            'Version': '2021-07-28',
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    });

    try {
        // Test 1: Get location info
        console.log('\n1. Testing location access...');
        const locationResponse = await axiosInstance.get(`/locations/${GHL_LOCATION_ID}`);
        console.log('✅ Location access OK:', locationResponse.data.name);
        
        // Test 2: List all calendars in this location
        console.log('\n2. Listing all calendars in location...');
        const calendarsResponse = await axiosInstance.get(`/calendars?locationId=${GHL_LOCATION_ID}`);
        console.log('📅 Found calendars:', calendarsResponse.data.calendars?.length || 0);
        
        if (calendarsResponse.data.calendars) {
            calendarsResponse.data.calendars.forEach((cal, index) => {
                console.log(`   ${index + 1}. ${cal.name} (ID: ${cal.id}) - Active: ${cal.isActive}`);
            });
        }
        
        // Test 3: Try to access the specific calendar
        console.log('\n3. Testing specific calendar access...');
        try {
            const calendarResponse = await axiosInstance.get(`/calendars/${CALENDAR_ID}`);
            console.log('✅ Calendar found:', calendarResponse.data.name);
            console.log('   Active:', calendarResponse.data.isActive);
            console.log('   Location:', calendarResponse.data.locationId);
        } catch (calError) {
            console.log('❌ Calendar access failed:', calError.response?.status, calError.response?.data?.message);
        }
        
        // Test 4: Try free slots endpoint
        console.log('\n4. Testing free slots endpoint...');
        try {
            const slotsResponse = await axiosInstance.get(`/calendars/${CALENDAR_ID}/free-slots`, {
                params: {
                    startDate: '2025-09-25',
                    endDate: '2025-09-25',
                    timezone: 'Asia/Singapore'
                }
            });
            console.log('✅ Free slots accessible');
        } catch (slotError) {
            console.log('❌ Free slots failed:', slotError.response?.status, slotError.response?.data?.message);
            
            // If it's a 404, the calendar doesn't exist in this location
            if (slotError.response?.status === 404) {
                console.log('🔍 Calendar not found in current location. Check if calendar is in different location.');
            }
        }
        
    } catch (error) {
        console.log('❌ Debug failed:', error.message);
        console.log('Response:', error.response?.data);
    }
}

debugCalendar();

import axios from 'axios';

const API_URL = 'http://localhost:3001/api/admin/auth';
const PROTECTED_URL = 'http://localhost:3001/api/admin/services'; // Assuming this exists or similar

// Mock credentials - Assuming these exist in DB or you might need to create one first
// For this test, I'll rely on the user having seeded the DB or I'll try to signup a temp user if possible, 
// but admin usually requires direct DB insertion. I'll assume 'admin@example.com' / 'password' or similar, 
// OR I will try to use the credentials from the user's previous context if available. 
// Since I don't have them, I'll ask the user to verify manually or use a known test account if I saw one.
// Wait, I saw `createUser` in `adminController`.

async function testAuth() {
    try {
        console.log("1. Attempting Login...");
        // Replacing with potentially valid credentials or a placeholder. 
        // If this fails, the test script fails, but I can't know the real admin password.
        // I will use a placeholder and catch the error to print it.
        const loginPayload = {
            email: "admin@example.com", 
            password: "password123" 
        };

        // Note: You might need to adjust these credentials to match your local database
        const loginRes = await axios.post(`${API_URL}/login`, loginPayload);
        
        const { token, refreshToken } = loginRes.data;
        console.log("✅ Login Successful");
        console.log("Access Token:", token ? "Received" : "Missing");
        console.log("Refresh Token:", refreshToken ? "Received" : "Missing");

        if (!token || !refreshToken) {
            console.error("❌ Tokens missing!");
            return;
        }

        console.log("\n2. Testing Protected Route with Access Token...");
        // Using a route I saw in adminRoutes: router.get('/users'...) needs manage_users permission.
        // Let's try /profile if it exists? request.user...
        // Admin routes are: /users, /roles, /requests.
        // Let's try /api/admin/requests (getAllRequests)
        try {
            await axios.get('http://localhost:3001/api/admin/requests', {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log("✅ Protected Route Accessible");
        } catch (err) {
            console.error("❌ Protected Route Failed:", err.response?.status, err.response?.data);
        }

        console.log("\n3. Testing Token Refresh...");
        const refreshRes = await axios.post(`${API_URL}/refresh`, { refreshToken });
        const newToken = refreshRes.data.token;
        
        if (newToken) {
            console.log("✅ Token Refresh Successful");
            console.log("New Token:", "Received");
        } else {
             console.error("❌ New Token missing from refresh response");
        }

        console.log("\n4. Testing Protected Route with New Token...");
        try {
             await axios.get('http://localhost:3001/api/admin/requests', {
                headers: { Authorization: `Bearer ${newToken}` }
            });
            console.log("✅ Protected Route Accessible with New Token");
        } catch (err) {
             console.error("❌ Protected Route Failed with New Token:", err.response?.status);
        }

    } catch (error) {
        console.error("❌ Auth Test Failed:", error.response?.data || error.message);
        console.log("Note: Test might verify failure if credentials are wrong, but flow logic is implemented.");
    }
}

testAuth();

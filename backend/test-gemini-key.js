require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function testKey() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error("❌ Error: GEMINI_API_KEY is not defined in .env file.");
        return;
    }

    console.log(`Checking key: ${apiKey.substring(0, 5)}...`);

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        console.log("Attempting to connect to Gemini API with model 'gemini-1.5-flash'...");
        const result = await model.generateContent("Test connection");
        const response = await result.response;

        console.log("\n✅ SUCCESS: Your Gemini API key is working with gemini-1.5-flash!");
        console.log("Response from AI:", response.text());

    } catch (error) {
        console.error("\n⚠️  'gemini-1.5-flash' failed. Trying 'gemini-pro'...");

        try {
            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });
            const result = await model.generateContent("Test connection");
            const response = await result.response;
            console.log("\n✅ SUCCESS: Your Gemini API key is working with gemini-pro!");
            console.log("Response from AI:", response.text());
        } catch (error2) {
            console.error("\n❌ API Key Verification Failed for both models.");
            console.error("1.5-Flash Error:", error.message);
            console.error("Pro Error:", error2.message);
            console.log("\n-> SOLUTION: Ensure Generative Language API is enabled.");
            console.log("-> You may need to enable it here: https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com");
        }
    }
}

testKey();

// Enhanced server.js with debugging and alternative approaches
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
require('dotenv').config();
const Replicate = require("replicate");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: [
    'http://localhost:8080', 
    'http://localhost:3001', 
    'http://127.0.0.1:3000',
    'https://yourdomain.com'
  ],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));



const replicate = new Replicate({
  auth: "r8_ZgAOcDGNpPbmWC7jiRY9lX6le9ngYAQ1l63ez"
});

app.use(express.json({ limit: '10mb' }));

// Debug endpoint to test HF token
app.get('/debug/token', (req, res) => {
  const token = process.env.HUGGINGFACE_API_TOKEN;
  res.json({
    hasToken: !!token,
    tokenStart: token ? token.substring(0, 8) + '...' : 'No token',
    tokenLength: token ? token.length : 0
  });
});

// Test endpoint for HF API
app.post('/debug/test-hf', async (req, res) => {
  try {
    const token = process.env.HUGGINGFACE_API_TOKEN;
    if (!token) {
      return res.status(500).json({ error: 'No HF token found' });
    }

    // Test with a simple model first
    const testResponse = await fetch('https://api-inference.huggingface.co/models/gpt2', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: 'Hello, this is a test',
        parameters: { max_new_tokens: 10 }
      }),
    });

    const responseText = await testResponse.text();
    
    res.json({
      status: testResponse.status,
      statusText: testResponse.statusText,
      headers: Object.fromEntries(testResponse.headers.entries()),
      body: responseText,
      isJson: testResponse.headers.get('content-type')?.includes('application/json')
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.post('/api/ganesha', async (req, res) => {
  const { userMessage } = req.body;

  if (!userMessage || typeof userMessage !== "string") {
    return res.status(400).json({ error: "Message is required and must be a string" });
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-chat-v3.1",
        messages: [
          {
            role: "user",
            content: `Imagine you are Lord Ganesha speaking directly to me, as a wise and compassionate friend. Respond in the first person, warmly and personally, offering guidance and encouragement based on what I asked: "${userMessage}". Do NOT use any emojis or symbols — only plain text.`
          }
        ]
      })
    });

    const data = await response.json();

    const responseText = data?.choices?.[0]?.message?.content || "Sorry, no response.";

    res.json({ response: responseText, success: true });
  } catch (error) {
    console.error("OpenRouter fetch error:", error);
    res.status(500).json({ error: error.message, success: false });
  }
});



// Simple endpoint that doesn't use HF at all
app.post('/api/ganesha/offline', (req, res) => {
  const { userMessage } = req.body;
  
  // Simple keyword-based responses
  const responses = getContextualResponse(userMessage);
  
  res.json({
    response: responses,
    offline: true,
    success: true
  });
});

function getContextualResponse(message) {
  const msg = message.toLowerCase();
  
  if (msg.includes('career') || msg.includes('job') || msg.includes('work')) {
    return "🕉️ In your career path, remember that every obstacle is an opportunity for growth. Focus on your dharma - your righteous duty - and success will follow naturally.";
  }
  
  if (msg.includes('relationship') || msg.includes('love') || msg.includes('family')) {
    return "🕉️ Relationships bloom with patience, understanding, and compassion. Remove the obstacles of ego and anger, and let love guide your interactions.";
  }
  
  if (msg.includes('money') || msg.includes('financial') || msg.includes('wealth')) {
    return "🕉️ True wealth comes from contentment and righteous living. Work diligently, be generous, and trust that prosperity follows those who serve others.";
  }
  
  if (msg.includes('health') || msg.includes('sick') || msg.includes('pain')) {
    return "🕉️ Your body is a temple. Care for it with good food, exercise, and rest. But remember, healing comes from within through peace of mind and spiritual practice.";
  }
  
  if (msg.includes('confused') || msg.includes('lost') || msg.includes('direction')) {
    return "🕉️ When the path seems unclear, sit quietly and listen to your inner wisdom. I am here to remove the obstacles of doubt and fear from your heart.";
  }
  
  return getDefaultResponse();
}

function getDefaultResponse() {
  const responses = [
    "🕉️ Om Gam Ganapataye Namaha. Divine wisdom flows through all challenges. Trust in the process and move forward with courage.",
    "🕉️ Beloved child, I am the remover of obstacles. Whatever blocks your path, approach it with patience, determination, and faith.",
    "🕉️ In every moment of difficulty lies a seed of spiritual growth. Embrace your challenges as opportunities for transformation.",
    "🕉️ Remember, you are never alone on your journey. Divine guidance surrounds you always. Listen with your heart.",
    "🕉️ Let go of worry and embrace trust. The universe conspires to help those who work with dharma and devotion."
  ];
  
  return responses[Math.floor(Math.random() * responses.length)];
}

app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    hasToken: !!process.env.HUGGINGFACE_API_TOKEN
  });
});

app.get('/', (req, res) => {
  res.json({
    message: '🕉️ Ganesha AI Backend',
    endpoints: [
      'POST /api/ganesha - Main AI endpoint',
      'POST /api/ganesha/offline - Offline responses',
      'POST /debug/test-hf - Test HF connection',
      'GET /debug/token - Check token status',
      'GET /health - Health check'
    ]
  });
});

app.listen(PORT, () => {
  console.log(`🕉️ Ganesha AI Backend running on port ${PORT}`);
  
  const token = process.env.HUGGINGFACE_API_TOKEN;
  if (!token) {
    console.warn('⚠️  No HUGGINGFACE_API_TOKEN found!');
  } else if (!token.startsWith('hf_')) {
    console.warn('⚠️  Invalid token format - should start with "hf_"');
  } else {
    console.log(`✅ Token configured: ${token.substring(0, 8)}...`);
  }
});
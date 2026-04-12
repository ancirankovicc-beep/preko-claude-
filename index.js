require('./main');
require('./shiva'); 
const path = require('path');
const express = require("express");
const app = express();
const port = 8888;

app.get('/', (req, res) => {
    const imagePath = path.join(__dirname, 'index.html');
    res.sendFile(imagePath);
});

// Keep-alive endpoint za UptimeRobot
app.get('/ping', (req, res) => {
    res.status(200).send('Bot je aktivan! 🟢');
});

app.listen(port, () => {
    console.log(`🔗 Listening to GlaceYT : http://localhost:${port}`);
});

// Auto-ping svakih 4 minute da Render ne uspava bot
const https = require('https');
const http = require('http');

const RENDER_URL = process.env.RENDER_EXTERNAL_URL || null;

if (RENDER_URL) {
    setInterval(() => {
        const url = RENDER_URL.startsWith('https') ? https : http;
        url.get(`${RENDER_URL}/ping`, (res) => {
            console.log(`✅ Keep-alive ping: ${res.statusCode}`);
        }).on('error', (err) => {
            console.error('❌ Keep-alive ping greška:', err.message);
        });
    }, 4 * 60 * 1000); // svakih 4 minute
    console.log(`🔄 Keep-alive aktivan za: ${RENDER_URL}`);
} else {
    console.log('⚠️ RENDER_EXTERNAL_URL nije postavljen - keep-alive nije aktivan');
}

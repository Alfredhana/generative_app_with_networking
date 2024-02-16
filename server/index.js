const express = require('express');
const path = require('path');
const osc = require('osc');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.resolve(__dirname, '../client/build')));

// Create a UDP port for receiving OSC messages
const udpPort = new osc.UDPPort({
  localAddress: '0.0.0.0', // listen on all available network interfaces
  localPort: 7011,
  metadata: true,
});

// Listen for incoming OSC messages
udpPort.on('message', function (oscMsg) {
  if (oscMsg.address === '/trigger' && oscMsg.args[0].value === 1) {
    // Send a WebSocket message to all connected clients
    wss.clients.forEach(function (client) {
      client.send('reload');
    });
  }
});

// Open the UDP port
udpPort.open();

// Handle GET requests to /api route
app.get("/api", (req, res) => {
    res.json({ message: "Hello from server!" });
});

// All other GET requests not handled before will return our React app
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});

const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Create a WebSocket server
const WebSocket = require('ws');
const wss = new WebSocket.Server({ server });

// Handle WebSocket connections
wss.on('connection', function (ws) {
  console.log('A WebSocket connection has been established.');

  ws.on('message', function (message) {
    console.log('Received WebSocket message:', message);
  });
});
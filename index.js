const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mqtt = require('mqtt');
const path = require('path');


// MQTT setup
const host = 'eu1.cloud.thethings.network';
const port = '1883';
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`;

const connectUrl = `mqtt://${host}:${port}`;
const client = mqtt.connect(connectUrl, {
    clientId,
    clean: true,
    connectTimeout: 4000,
    username: 'reclaimers-application@ttn',
    password: 'NNSXS.KWM4WJNYY47RSOAIYTLN5P4JKP34PZQ5YLHPP3Y.BLC7H3ALK7KZ42PTWVM4GIYNVCP3CN6WCYEY5PQZTMFPZNFLSBFQ',
    reconnectPeriod: 1000,
});

const topic = 'v3/reclaimers-application@ttn/devices/reclaimerssignaltesters/up';

// Web server setup
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve the main HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// MQTT event handling
client.on('connect', () => {
    console.log('Connected to MQTT broker');
    client.subscribe([topic], () => {
        console.log(`Subscribed to topic '${topic}'`);
    });
});

client.on('message', (topic, payload) => {
    console.log('Received Message:', topic, payload.toString());
    io.emit('mqttData', payload.toString()); // Send data to web client
});

client.on('error', (error) => {
    console.error('Connection error:', error);
});

// Start server
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

const mqtt = require('mqtt');

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

client.on('connect', () => {
    console.log('Connected');

    client.subscribe([topic], () => {
        console.log(`Subscribed to topic '${topic}'`);
    });
});

client.on('message', (topic, payload) => {
    console.log('Received Message:', topic, payload.toString());
});

client.on('error', (error) => {
    console.error('Connection error:', error);
});

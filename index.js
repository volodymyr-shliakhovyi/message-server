const mqemitterRedis = require('mqemitter-redis')
const express = require('express')
const mqttConnection = require('mqtt-connection')
const { createServer } = require('aedes-server-factory')
const rClient = require('./utils/redis.js')

const app = express()
const EXPRESS_PORT = 3000

// Create a Redis emitter
const redisEmitter = mqemitterRedis({
	port: 6379, // Redis server port
	host: 'localhost', // Redis server host
	db: 0 // Redis database index
})

const aedes = require('aedes')({
	mq: redisEmitter,
	persistence: require('aedes-persistence-redis')({
		port: 6379, // Redis server port
		host: 'localhost', // Redis server host
		family: 4, // 4 (IPv4) or 6 (IPv6)
		db: 0, // Redis database index
		maxClients: 100, // Maximum number of clients that can be persisted
		keyPrefix: 'aedes-persistence' // Redis key prefix
	})
})

const mqttServer = createServer(aedes)

const MQTT_PORT = 1883 // You can change the port as needed

mqttServer.listen(MQTT_PORT, function () {
	console.log(`Aedes MQTT server listening on port ${MQTT_PORT}`)
})

aedes.on('client', async function (client) {
	console.log(`Client connected: ${client.id}`, rClient)
	// check if we have the shadow for this device id
	const x = await rClient.rClient.get('key')
	console.log(client.id, 'shadow', x)
})

aedes.on('clientDisconnect', function (client) {
	console.log(`Client disconnected: ${client.id}`)
})

aedes.on('publish', function (packet, client) {
	if (client) {
		console.log(
			`Message from client ${client.id}: ${packet.payload.toString()}`
		)
	}
})

// Define a route for handling MQTT over WebSocket connections
app.get('/device/shadow/update', (req, res) => {
	console.log(`update shadow`)

	// res.sendFile(__dirname + '/mqtt.html') // Create an HTML file for MQTT over WebSocket
})

// Start the Express server
app.listen(EXPRESS_PORT, () => {
	console.log(`Express server listening on port ${EXPRESS_PORT}`)
})

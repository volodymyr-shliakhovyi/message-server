const redis = require('redis')

// Create a Redis client
const client = redis.createClient({
	db: 1
})

client.connect()

// Event listeners for connection-related events
client.on('connect', function () {
	console.log('Connected to Redis server')
	client.get('foo', function (err, reply) {
		console.log('vl', reply)
	})
})

client.on('error', function (err) {
	console.error('Error connecting to Redis:', err)
})

const getRedisValue = async (key) => {
	console.log('getRedisValue', key)
	// const value = await client.get(key)
	// return value
}

const setRedisValue = async (key, value) => {
	// await client.set('key', 'value3')
	// console.log('setRedisValue', value)
}

exports.rClient = client

const keys = require('./keys')
const redis = require('redis')

// Connect to Redis
const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort
})

const fibo = {}
// Create a copy of the Redis Client
const redisSubscriber = redisClient.duplicate()

// Tell Redis Client we want to listen for the fibonacci topic
redisSubscriber.subscribe('fibonacci')

// Define what to do when receive the message at the subscribed topics
redisSubscriber.on('message', (_, index) => {
    let value = fibonacci(parseInt(index))
    console.log(`f(${index}) = ${value}`)
    redisClient.hset('fibonacci-history', index, value)
})

// Returns the fibonnaci value
function fibonacci(index) {
    if (index < 2) return 1
    if (fibo[index]) return fibo[index]
    return  fibo[index] = fibonacci(index - 1) + fibonacci(index - 2)
}
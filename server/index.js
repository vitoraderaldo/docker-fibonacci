const keys = require('./keys')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(bodyParser.json())


const { Pool } = require('pg')
const pgClient = new Pool({
    user: keys.pgUser,
    host: keys.pgHost,
    database: keys.pgDatabase,
    password: keys.pgPassword,
    port: keys.pgPort
})

const redis = require('redis')
const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort
})

const redisPublisher = redisClient.duplicate()

app.get('/', (req, res) => {
    res.send('Hello')
})

app.get('/values/all', async (req, res) => {
    await pgClient.query("CREATE TABLE IF NOT EXISTS values(number INT)");
    const value = await pgClient.query('SELECT * FROM values')
    res.send(value.rows)
})

app.get('/values/current', async (req, res) => {
    redisClient.hgetall('fibonacci-history', (err, values) => {
        res.send(values)
    })
})

app.post('/calculate', async (req, res) => {
    await pgClient.query("CREATE TABLE IF NOT EXISTS values(number INT)");
    const {index} = req.body    
    redisPublisher.publish('fibonacci', index)
    pgClient.query('INSERT INTO values (number) VALUES($1)', [index])
    res.send({working: true})
})

app.listen(5000, err => {
    console.log('Listening...')
})
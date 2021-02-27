const express = require('express')
const http = require('http')
const cors = require('cors')
const morgan = require('morgan')
const socketio = require('socket.io')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const app = express()
app.use(morgan('dev'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors())

app.get('/', (req, res) => res.send('Bad request'))

// Main Routes
const authRoute = require('./api/routes/auth')
const userRoute = require('./api/routes/user')

// API URL's
app.use('/api/v1/auth', authRoute)
app.use('/api/v1/user', userRoute)

const server = http.createServer(app)
const io = socketio(server)

let rooms = []

io.on('connection', (socket) => {
    console.log('User connected')

    // Join
    socket.on('join', (data) => {

        // Find room
        const existRoom = rooms.find((room) => room === data.room)
        if (!existRoom) {
            rooms.push(data.room)
        }

        socket.join(data.room)

        socket.emit('message', { message: `room no ${data.room}` })
        console.log(rooms)
    })

    // Messages
    socket.on('message', (data) => {
        socket.broadcast.to(data.room).emit('message', { message: data.message })
    })


    socket.on('disconnect', () => {
        console.log('User disconnected')
    })
})

// DB Connection
mongoose.connect('mongodb+srv://mamun166009:1118964208@cluster0-lkz2b.mongodb.net/chithi?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useNewUrlParser: true
})

const database = mongoose.connection

database.on('error', (err) => {
    console.log(err.message)
})
database.once('open', () => {
    console.log('MongoDB connection success')
})

// App Port
const port = process.env.PORT || 4000
server.listen(port, () => {
    console.log(`App running on ${port} port`)
})
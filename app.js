const express = require("express")
const http = require("http")
const cors = require("cors")
const morgan = require("morgan")
const socketio = require("socket.io")
const bodyParser = require("body-parser")

const app = express()
app.use(morgan('dev'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors())

const Route = require("./api/routes/route")
app.use(Route)

// const server = http.createServer(app)
// const io = socketio(server)

// io.on('connection', (socket) => {
//     console.log('User connected')

//     // Join
//     socket.on("join", (data) => {
//         socket.join(data.room)
//         socket.emit('message', { message: `Welcome ${data.name} to room no ${data.room}` })
//     })

//     // Messages
//     socket.on('message', (data) => {
//         socket.broadcast.to(data.room).emit("message", { message: data.message })
//     })


//     socket.on('disconnect', () => {
//         console.log('User disconnected')
//     })
// })

// App Port
const port = process.env.PORT || 4000
app.listen(port, () => {
    console.log(`App running on ${port} port`)
})
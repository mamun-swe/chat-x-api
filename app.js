const express = require("express")
const cors = require("cors")
const http = require("http")
const morgan = require("morgan")
const socketio = require("socket.io")
const bodyParser = require("body-parser")

const app = express()
app.use(morgan('dev'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors)

const server = http.createServer(app)
const io = socketio(server)


app.get('/', (req, res) => {
    res.json('I am alive')
})

io.on('connection', (socket) => {
    console.log('User connected')

    // Join
    socket.on("join", (data) => {
        socket.join(data.room)
        socket.emit('message', { message: `Welcome ${data.name} to room no ${data.room}` })
    })

    // Messages
    socket.on('message', (data) => {
        socket.broadcast.to(data.room).emit("message", { message: data.message })
    })


    socket.on('disconnect', () => {
        console.log('User disconnected')
    })
})




// App Port
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    console.log(`server running on ${PORT}`);
});

const express = require('express')
const http = require('http')
const cors = require('cors')
const morgan = require('morgan')
const socketio = require('socket.io')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const Messages = require('./models/Message')
const MessageController = require('./api/controllers/MessageController')


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
    socket.on('join', async (data) => {

        // Find room
        const findRoom = rooms.find((room) =>
            room.sender === data.room.sender && room.reciver === data.room.reciver ||
            room.sender === data.room.reciver && room.reciver === data.room.sender
        )

        if (!findRoom) {
            rooms.push(data.room)
            socket.join(data.room)
        } else {
            socket.join(findRoom)
        }

        let messages = MessageController.GetMessage(data)

        messages.then(function (result) {
            socket.emit('message', { message: result })
        })



    })

    // Send Messages
    socket.on('message', (data) => {

        const findRoom = rooms.find((room) =>
            room.sender === data.sender && room.reciver === data.reciver ||
            room.sender === data.reciver && room.reciver === data.sender
        )

        socket.broadcast.to(findRoom).emit('message', { message: data })
        MessageController.SendMessage(data)

    })

    // // Get Messages
    // socket.on("getmessage", async ({ sender, reciver }, callback) => {
    //     try {

    //         const senderA = mongoose.Types.ObjectId(sender)
    //         const reciverA = mongoose.Types.ObjectId(reciver)

    //         let final = []

    //         // Result for A user
    //         let result1 = await Messages.find({ $and: [{ sender: senderA }, { reciver: reciverA }] }, { _id: 0 })

    //         // Result for B user
    //         let result2 = await Messages.find({ $and: [{ sender: reciverA }, { reciver: senderA }] }, { _id: 0 })

    //         for (let index = 0; index < result1.length; index++) {
    //             const element = result1[index];
    //             final.push(element)
    //         }

    //         for (let index = 0; index < result2.length; index++) {
    //             const element = result2[index];
    //             final.push(element)
    //         }

    //         // Sort by date
    //         final.sort(function (a, b) {
    //             return new Date(a.createdAt) - new Date(b.createdAt);
    //         });

    //         callback(final);

    //     } catch (e) {
    //         console.error(e);
    //     }
    // });



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
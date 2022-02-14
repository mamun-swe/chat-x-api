const mongoose = require('mongoose')
const Schema = mongoose.Schema

const messageSchema = new Schema({
    sender: {
        type: mongoose.Types.ObjectId
    },
    reciver: {
        type: mongoose.Types.ObjectId
    },
    message: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})


const messageModel = mongoose.model('message', messageSchema)
module.exports = messageModel
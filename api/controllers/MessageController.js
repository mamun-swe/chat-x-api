const mongoose = require('mongoose')
const Message = require('../../models/Message')

const GetMessage = async (data) => {
    try {

        let messages = []
        const sender = mongoose.Types.ObjectId(data.room.sender)
        const reciver = mongoose.Types.ObjectId(data.room.reciver)

        // Result for A user
        let result1 = await Message.find({ $and: [{ sender: sender }, { reciver: reciver }] }, { _id: 0 }).exec()

        // Result for B user
        let result2 = await Message.find({ $and: [{ sender: reciver }, { reciver: sender }] }, { _id: 0 }).exec()

        for (let index = 0; index < result1.length; index++) {
            const element = result1[index];
            messages.push(element)
        }

        for (let index = 0; index < result2.length; index++) {
            const element = result2[index];
            messages.push(element)
        }

        // Message sort by date
        messages.sort(function (a, b) {
            return new Date(a.createdAt) - new Date(b.createdAt);
        })
        

        return messages

    } catch (error) {
        if (error) {
            console.log(error)
        }
    }
}


const SendMessage = async (data) => {
    try {

        const newMessage = new Message({
            sender: mongoose.Types.ObjectId(data.sender),
            reciver: mongoose.Types.ObjectId(data.reciver),
            message: data.message
        })

        await newMessage.save()

    } catch (error) {
        if (error) {
            console.log(error)
        }
    }
}


module.exports = {
    GetMessage,
    SendMessage
}
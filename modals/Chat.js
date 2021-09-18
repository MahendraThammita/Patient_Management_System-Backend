const mongoose = require('mongoose');
const  Schema = mongoose.Schema;

const chatSchema = new Schema({

    roomId: {
        type: String,
        required: true
    },
    user1: {
        type: String,
        required: true
    },
    user2: {
        type: String,
        required: true
    },
    message: {
        type: Array,
        required: false
    },
    userType: {
        type: String,
        required: true
    },
})
const Chat = mongoose.model("Chat", chatSchema);
module.exports = Chat;
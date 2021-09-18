const mongoose = require('mongoose');
const  Schema = mongoose.Schema;

const nurseSchema = new Schema({

    Fname: {
        type: String,
        required: true
    },
    Lname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    nic: {
        type: String,
        required: true
    },
    mobileNumber: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    profileImage: {
        type: String,
        required: false
    },
    Appointments:[{
        type: mongoose.Schema.Types.ObjectId, 
        required: false,
        ref: 'Appointment'

    }],
    recentChats:[{type : Schema.Types.ObjectId, ref : 'Chat'}]
})
const Nurse = mongoose.model("Nurse", nurseSchema);
module.exports = Nurse;
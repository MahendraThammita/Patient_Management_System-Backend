const mongoose = require('mongoose');
const  Schema = mongoose.Schema;

const recepSchema = new Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    mobileNumber: {
        type: Number,
        required: true
    },
    specialty: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
})
const Doctor = mongoose.model("Doctor", recepSchema);
module.exports = Doctor;
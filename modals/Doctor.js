const mongoose = require('mongoose');
const  Schema = mongoose.Schema;

const doctorSchema = new Schema({
    doctorID: {
        type: String,
        required: true
    },
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
    timeSlots: {
        type: Array,
        required: false
    },
    profileImage: {
        type: String,
        required: false
    },
    status: {
        type: String,
        required: true
    }
})
const Doctor = mongoose.model("Doctor", doctorSchema);
module.exports = Doctor;
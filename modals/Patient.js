const mongoose = require('mongoose');
const  Schema = mongoose.Schema;

const patientSchema = new Schema({

    fullName: {
        type: String,
        required: true
    },
    suffix: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    Proffesion: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    guardianName: {
        type: String,
        required: false
    },
    guardianPhone: {
        type: String,
        required: false
    },
    guardianEmail: {
        type: String,
        required: true
    }
})
const Patient = mongoose.model("Patient", patientSchema);
module.exports = Patient;
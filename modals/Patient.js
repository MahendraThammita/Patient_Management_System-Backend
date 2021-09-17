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
    dateOfBirth: {
        type: Date,
        required: true
    },
    profession: {
        type: String,
        required: false
    },
    addressLine1: {
        type: String,
        required: true
    },
    addressLine2: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    phone: {
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
        required: true
    },
    guardianPhone: {
        type: String,
        required: true
    },
    guardianEmail: {
        type: String,
        required: true
    },
    medications: {
        type: Array,
        required: false
    },
})
const Patient = mongoose.model("patient", patientSchema);
module.exports = Patient;
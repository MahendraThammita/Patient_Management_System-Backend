const mongoose = require('mongoose');
const  Schema = mongoose.Schema;

const recepSchema = new Schema({
    employeeID: {
        type: String,
        required: true
    },
    username: {
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
})
const Receptionist = mongoose.model("Receptionist", recepSchema);
module.exports = Receptionist;
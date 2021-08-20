const mongoose = require('mongoose');
const  Schema = mongoose.Schema;

const labStaffSchema = new Schema({

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
    tests:[{
        type: mongoose.Schema.Types.ObjectId, 
        required: false,
        ref: 'Appointment'

    }]
})
const LabStaff = mongoose.model("LabStaff", labStaffSchema);
module.exports = LabStaff;
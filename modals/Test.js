const mongoose = require('mongoose');
const  Schema = mongoose.Schema;

const testSchema = new Schema({

    testName: {
        type: String,
        required: true,
        trim: true
    },
    specimonNumber: {
        type: String,
        required: false,
        trim: true
    },
    results: {
        type: Array, 
        required: false,
    },
    specialRemarks: {
        type: String,
        required: false,
        trim: true
    },
    status: {
        type: String,
        required: true,
        trim: true
    },
    labStaff: {
        type: mongoose.Schema.Types.ObjectId, 
        required: false,
        ref: 'LabStaff'

    },
    Appointment:{
        type: mongoose.Schema.Types.ObjectId, 
        required: true,
        ref: 'Appointment'

    },
    doctor:{
        type: mongoose.Schema.Types.ObjectId, 
        required: true, 
        ref: 'Doctor'
    },
    patient:{
        type: mongoose.Schema.Types.ObjectId, 
        required: true, 
        ref: 'patient'
    },
    date:{
        type: String, 
        required: false,
    },
    TimeSlot:{
        type:String,
        required:false
    },
    specimonNumber: {
        type: String,
        required: false,
        trim: true
    },
    specimonType: {
        type: String,
        required: false,
        trim: true
    },
})
const Test = mongoose.model("Tests", testSchema);
module.exports = Test;
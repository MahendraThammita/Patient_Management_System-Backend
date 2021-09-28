const mongoose = require('mongoose');
const  Schema = mongoose.Schema;

const appointmentSchema = new Schema({

    approvedStatus: {
        type: Boolean,
        required: true
    },
    status:{
        type:String,
        required: true
    },
    prescription:{
        type: mongoose.Schema.Types.ObjectId, 
        required: false, 
        ref: 'prescription'
    },
    patientMessage:{
        type:String,
        required:false
    },
    reports:{
        type:Array,
        required:false
    },
    appointmentDate:{
        type:Date,
        required:true
    },
    appointmentTimeSlot:{
        type:String,
        required:true
    },
    patient:{
        type: mongoose.Schema.Types.ObjectId, 
        required: true, 
        ref: 'patient'
    },
    doctor:{
        type: mongoose.Schema.Types.ObjectId, 
        required: true, 
        ref: 'Doctor'
    },
    tests:{
        type: Array, 
        required: true,
    },
    date:{
        type: String, 
        required: false,
    },
    time:{
        type: String, 
        required: false,
    },
    
    
})

const Appointment = mongoose.model("appointment", appointmentSchema);
module.exports = Appointment;
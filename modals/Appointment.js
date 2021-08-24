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
        type:Array,
        required: false
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
        type:String,
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
    
    
})

const Appointment = mongoose.model("appointment", appointmentSchema);
module.exports = Appointment;
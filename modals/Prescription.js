const mongoose = require('mongoose');
const  Schema = mongoose.Schema;

const prescriptionSchema = new Schema({

    fullName:{
        type:String,
        required: true
    },
    status:{
        type:String,
        required: true
    },
    previouslyVisited: {
        type: Boolean,
        required: true
    },
    age:{
        type:Number,
        required: true
    },
    weight:{
        type:Number,
        required: true
    },
    height:{
        type:Number,
        required:true
    },
    bp_Systolic:{
        type:Number,
        required:true
    },
    bp_Diastolic:{
        type:Number,
        required:true
    },
    specialRemarks_By_Nurse:{
        type:String,
        required: false
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
    docDesc:{
        type:String,
        required: false
    },
    startWeek:{
        type:String,
        required: false
    },
    endWeek:{
        type:String,
        required: false
    },
    
    
})

const Prescription = mongoose.model("prescription", prescriptionSchema);
module.exports = Prescription;
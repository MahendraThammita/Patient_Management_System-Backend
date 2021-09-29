const mongoose = require('mongoose');
const  Schema = mongoose.Schema;

const testSchema = new Schema({

    name: {
        type: String,
        required: true,
        trim: true
    },
    specimonNumber: {
        type: String,
        required: true,
        trim: true
    },
    results: [{
        componant: {type: String,trim: true},
        value: {type: String,trim: true},
        remark: {type: String,trim: true},
    }],
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
})
const Test = mongoose.model("NuTestrse", testSchema);
module.exports = Test;
const mongoose = require('mongoose');
const  Schema = mongoose.Schema;

const scheduleSchema = new Schema({

    timeSlot: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
})
const Schedule = mongoose.model("Schedule", scheduleSchema);
module.exports = Schedule;
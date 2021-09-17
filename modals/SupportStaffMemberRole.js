const mongoose = require('mongoose');
const  Schema = mongoose.Schema;

const supportStaffMemberRoleSchema = new Schema({

    Role: {
        type: String,
        required: true
    },
    MemberId:{
        type:mongoose.Schema.Types.ObjectId,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    
    
})

const SupportStaffMemberRole = mongoose.model("supportStaffMemberRole", supportStaffMemberRoleSchema);
module.exports = SupportStaffMemberRole;
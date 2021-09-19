const router = require('express').Router();
const Appointment = require('../modals/Appointment');
const moment= require('moment'); 
const Prescription = require('../modals/Prescription');
const ObjectId = require('mongodb').ObjectID;

router.post('/create',async (req,res) =>{
    const {
        weight,
        height,
        sys_pressure,
        dis_pressure,
        specialRemarks_By_Nurse,
        fullName,
        previouslyVisited,
        age,
        patient,
        doctor,
        status,
        appointmentId
    } = req.body
    try{
        const data = await Prescription.create({
            
            weight:weight,
            height:height,
            bp_Systolic:sys_pressure,
            bp_Diastolic:dis_pressure,
            specialRemarks_By_Nurse:specialRemarks_By_Nurse,
            fullName:fullName,
            previouslyVisited:previouslyVisited,
            age:age,
            patient:patient,
            doctor:doctor,
            status:status,
        }).then(async (prescription) => {
            
            await Appointment.countDocuments({_id: appointmentId}, async (err, count) => { 
                if(count>0){
                    const updateValue = { prescription: prescription._id };
                    await Appointment.findByIdAndUpdate(appointmentId,updateValue).then(()=>{
                        res.json({status:200, message:"ok"})
                    }).catch((err) => {
                        res.json({status:400, error:err})
                    })
                }
            });
        }).catch((err) => {
            res.json({status:400, message:err})
        })
         
    }catch(err){
        console.log(err)
        res.json({error: err})
    }
 })


module.exports = router;
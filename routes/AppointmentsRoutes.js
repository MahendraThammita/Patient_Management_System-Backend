const router = require('express').Router();
const Appointment = require('../modals/Appointmnet');


//create appointment
router.post('/create',async (req,res) =>{
    const {
        approvedStatus = 'false',
        status,
        patientMessage,
        appointmentDate,
        appointmentTimeSlot,
        patient,
        doctor
    } = req.body
 
    try{
        const data = await Appointment.create({
            
            approvedStatus:approvedStatus,
            status:status,
            patientMessage:patientMessage,
            appointmentDate:appointmentDate,
            appointmentTimeSlot:appointmentTimeSlot,
            patient:patient,
            doctor:doctor 
        })

        //  console.log(data)
         res.status(200)
         res.json({"message" : "ok"})
    }catch(err){
        console.log(err)
        res.json({error: err})
    }
 })


module.exports = router;
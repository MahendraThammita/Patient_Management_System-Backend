const router = require('express').Router();
const Appointment = require('../modals/Appointment');


//create appointment
router.post('/create',async (req,res) =>{
    const {
        patientMessage,
        appointmentDate,
        appointmentTimeSlot,
        patient,
        doctor
    } = req.body
 
    try{
        const data = await Appointment.create({
            
            approvedStatus: false,
            status:"pending",
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
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

 router.route("/").get((req,res) => {

    Appointment.find().then((appointments) => {
        res.json({appointments});
    }).catch((err) => {
        res.json({err});
    })

})

 //get appointments for a patient
router.route('/get/:id').get(async(req, res) => {

    const data = await Appointment.find({ patient: req.params.id}).populate('doctor')
    .then(data => {
        res.status(200).send(data);
    })
    .catch(error => {
        res.status(500).send({ error: error.message });
    });
})


module.exports = router;
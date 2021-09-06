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
    
     try {
        var test = []
        await Appointment.find({ patient: req.params.id}).populate('doctor')
        .then(data => {
            
            data.map(item => {
                var apnt = {
                    "appointmentId" : item._id,
                    "appointmentDate" : item.appointmentDate,
                    "appointmentTimeSlot" : item.appointmentTimeSlot,
                    "doctor" : item.doctor.fullName,
                    "appointmentStatus" : [String(item.approvedStatus)]
                }
                // console.log(item)
            test.push(apnt)
        })
    })

    res.json(test)
         
     } catch (error) {
        console.log(error)
        res.json({error: error})
     }
})


module.exports = router;
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
                    "doctorID": item.doctor._id,
                    "doctor" : item.doctor.fullName,
                    "appointmentMsg" : item.patientMessage,
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

//delete appointment
router.route("/delete/:appointmentID").get((req,res) => {

    const appointmentID = req.params.appointmentID;

    Appointment.findByIdAndDelete(appointmentID).then(() => {
        res.json({status:200, message:'Successfully deleted'})
    }).catch((err) => {
        res.json({err});
    })

})


//patient profile update
router.put('/update/:appointmentId', async (req,res) => {

    let appointmentId = req.params.appointmentId;
    const {
        patientMessage,
        appointmentDate,
        appointmentTimeSlot,
        doctor,
        patient
    } = req.body

    try{
        const newData = {
            approvedStatus: false,
            status:"pending",
            patientMessage:patientMessage,
            appointmentDate:appointmentDate,
            appointmentTimeSlot:appointmentTimeSlot,
            patient:patient,
            doctor:doctor 
        }

        const  updateValue = await Appointment.findByIdAndUpdate(appointmentId,newData).then(() => {
            res.json({status:200, message:'successfully updated'})
        }).catch((err) => {
            res.json({status:400, error:err})
        })
    }catch(err){
        console.log(err)
        res.json({error: err})
    }
    // console.log(pass)
})

module.exports = router;
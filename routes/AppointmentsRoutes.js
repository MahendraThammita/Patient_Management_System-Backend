const router = require('express').Router();
const Appointment = require('../modals/Appointment');
const moment= require('moment') 


//create appointment
router.post('/create',async (req,res) =>{
    const {
        patientMessage,
        appointmentDate,
        appointmentTimeSlot,
        patient,
        doctor
    } = req.body
    var hour = appointmentTimeSlot.slice(0,-3)
    var minute = appointmentTimeSlot.slice(3)
    var timeWithHour = moment(appointmentDate).set('hour', parseInt(hour));
    var timeSlot = moment(timeWithHour).set('minute', parseInt(minute));
    try{
        const data = await Appointment.create({
            
            approvedStatus: false,
            status:"pending",
            patientMessage:patientMessage,
            appointmentDate:timeSlot,
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
        await Appointment.find({ patient: req.params.id}).populate('doctor').populate('patient')
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

 //get appointment by appointment id
 router.route('/getById/:id').get(async(req, res) => {
    
    try {
       await Appointment.find({ _id: req.params.id})
       .populate('doctor')
       .populate('patient')
       .then(data => {
            var age = moment().diff(data[0].patient.dateOfBirth, 'years',false);
            res.json({data : data , age:age});
        }).catch((err) => {
            res.json({err});
        })
    } catch (error) {
       console.log(error)
       res.json({error: error})
    }
})

//Get appointments according to the current day
router.route('/getAppoinments_today').get(async(req, res) => {
    
    try {
        await Appointment.find({})
        .populate('patient' , 'fullName age dateOfBirth')
        .populate('doctor' , 'fullName email')
        .then((appointments) => {
            var todayAppointments = [];
            appointments.map(appointment => {
                if(moment(appointment.appointmentDate).isSame(moment() , 'day')){
                    todayAppointments.push(appointment);
                }
            })
            let sortedtodayAppointments = todayAppointments.sort(function(a, b){
                return moment(a.appointmentDate).diff(b.appointmentDate);
            });
            res.json({sortedtodayAppointments});
        }).catch((err) => {
            res.json({err});
        })
    } catch (error) {
       console.log(error)
       res.json({error: error})
    }
})


module.exports = router;
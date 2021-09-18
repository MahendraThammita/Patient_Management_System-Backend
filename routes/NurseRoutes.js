const router = require('express').Router();
const Nurse = require('../modals/Nurse');


//create appointment
router.post('/create',async (req,res) =>{
    const {
        Fname,
        Lname,
        email,
        mobileNumber,
        password,
        profileImage,
        Appointments
    } = req.body
 
    try{
        const data = await Appointment.create({
            
            Fname:Fname,
            Lname:Lname,
            email:email,
            mobileNumber:mobileNumber,
            password:password,
            profileImage:profileImage,
            Appointments:Appointments, 
            NIC:NIC
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
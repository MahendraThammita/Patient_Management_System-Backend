const router = require('express').Router();
const Doctor = require('../modals/Doctor');
const Schedule = require('../modals/Schedule')
const bcrypt = require("bcrypt");

router.post("/add", async (req,res) => {

    let doctorID = req.body.doctorID;
    let fullName = req.body.fullName;
    let email = req.body.email;
    let specialty = req.body.specialty;
    let username = req.body.username;
    let mobileNumber = req.body.mobileNumber;
    let password = req.body.password;

    const isExisting = await Doctor.findOne({"doctorID": doctorID});

    if (isExisting){
        return res.status(401).json("Doctor already exist!");
    }
    else{
        const salt = await bcrypt.genSalt();
        const hash = await bcrypt.hash(password, salt);
        const doctor = new Doctor({

            doctorID: doctorID,
            fullName: fullName,
            email: email,
            specialty: specialty,
            username: username,
            mobileNumber: mobileNumber,
            password: hash
        });

        doctor.save().then(() => {
            return res.status(201).json("Doctor Added ");
        }).catch((err) => {
            return res.status(400).json(err);
        })
    }

})

router.put("/add-time-slot/:doctorID", async (req,res) => {

    const doctorID = req.params.doctorID;

    let timeSlot = req.body.timeSlot;
    let status = req.body.status;

    const isExisting = await Doctor.findById(doctorID).find({timeSlots: {$elemMatch: {timeSlot:timeSlot}}});
    console.log(isExisting);

    if (isExisting.length !== 0){
        return res.status(401).json("Duplicated time slot!");
    }
    else{

        const schedule = new Schedule({

            timeSlot: timeSlot,
            status: status,

        });

        await Doctor.findOneAndUpdate({'_id':doctorID}, {"$push":{"timeSlots":schedule}}).then(() => {
            return res.status(201).json("Time Slot Added ");
        }).catch((err) => {
            console.log(err);
        })

    }

})

module.exports = router;
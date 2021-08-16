const router = require('express').Router();
const Doctor = require('../modals/Doctor');
const bcrypt = require("bcrypt");

router.post("/register", async (req,res) => {

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

module.exports = router;
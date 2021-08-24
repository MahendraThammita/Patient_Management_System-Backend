const router = require('express').Router();
const Doctor = require('../modals/Doctor');
const Schedule = require('../modals/Schedule');
const bcrypt = require("bcrypt");
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

const storage = multer.diskStorage({
    destination: './uploads/doctor',
    filename: function (req, file, callback){
        const imageID = uuidv4();
        const uploadName = imageID+file.originalname;
        callback(null, uploadName);
    }

});

const upload = multer({storage:storage});

router.post("/add", upload.single('profileImage'), async (req,res) => {

    let doctorID = req.body.doctorID;
    let fullName = req.body.fullName;
    let email = req.body.email;
    let specialty = req.body.specialty;
    let username = req.body.username;
    let mobileNumber = req.body.mobileNumber;
    let password = req.body.password;
    let profileImage =  req.file.filename;

    const isExisting = await Doctor.findOne({"doctorID": doctorID});

    if (isExisting){
        res.json({status:400, message:'Doctor already exist'})
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
            password: hash,
            profileImage: profileImage
        });

        doctor.save().then(() => {
            res.json({status:201, message:'Doctor Added'})
        }).catch((err) => {
            res.json({status:400, message:err})
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
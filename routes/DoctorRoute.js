const router = require('express').Router();
const Doctor = require('../modals/Doctor');
const Schedule = require('../modals/Schedule');
const bcrypt = require("bcrypt");
const multer = require('multer');

const storage = multer.diskStorage({
    destination: './uploads',
    filename: function (req, file, callback){
        callback(null, file.originalname);
    }

});

const upload = multer({storage:storage});

router.post("/add", upload.single('profileImage'), async (req,res) => {

    let fullName = req.body.fullName;
    let email = req.body.email;
    let specialty = req.body.specialty;
    let username = req.body.username;
    let mobileNumber = req.body.mobileNumber;
    let password = req.body.password;
    let profileImage =  req.file.originalname;
    let status = req.body.status;

    const isExisting = await Doctor.findOne({"fullName": fullName});

    if (isExisting){
        res.json({status:400, message:'Doctor already exist'})
    }
    else{
        const salt = await bcrypt.genSalt();
        const hash = await bcrypt.hash(password, salt);
        const doctor = new Doctor({

            fullName: fullName,
            email: email,
            specialty: specialty,
            username: username,
            mobileNumber: mobileNumber,
            password: hash,
            profileImage: profileImage,
            status: status
        });

        doctor.save().then((doctor) => {
            res.json({status:201, doctor:doctor})
        }).catch((err) => {
            res.json({status:400, message:err})
        })
    }

})

router.post("/add-time-slot/:doctorID", async (req,res) => {

    const doctorID = req.params.doctorID;

    let timeSlot = req.body.timeSlot;
    let status = req.body.status;

    const isExisting = await Doctor.findById(doctorID).find({timeSlots: {$elemMatch: {timeSlot:timeSlot}}});

    if (isExisting.length !== 0){
        res.json({status:401, message:'duplicated'})
    }
    else{

        const schedule = new Schedule({

            timeSlot: timeSlot,
            status: status,

        });

        await Doctor.findOneAndUpdate({'_id':doctorID}, {"$push":{"timeSlots":schedule}}).then(() => {
            res.json({status:201, message:'success'})
        }).catch((err) => {
            console.log(err);
        })

    }

})

router.route("/").get((req,res) => {

    Doctor.find().then((doctors) => {
        res.json({doctors});
    }).catch((err) => {
        res.json({err});
    })

})

module.exports = router;
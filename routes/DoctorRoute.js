const router = require('express').Router();
const Doctor = require('../modals/Doctor');
const Schedule = require('../modals/Schedule');
const jwt = require("jsonwebtoken");
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

router.route("/:doctorID").get((req,res) => {

    const doctorID = req.params.doctorID;

    Doctor.find({_id:doctorID}).then((doctor) => {
        res.json({doctor});
    }).catch((err) => {
        res.json({err});
    })

})

router.put("/update/:userID", upload.single('profileImage'), async (req,res) => {

    try{

        let userID = req.params.userID;
        let fullName = req.body.fullName;
        let email = req.body.email;
        let specialty = req.body.specialty;
        let username = req.body.username;
        let mobileNumber = req.body.mobileNumber;
        let status = req.body.status;
        let updatedValue;


        const isExisting = await Doctor.findOne({_id: userID});

        if(!req.file) {
            updatedValue = {
                fullName: fullName,
                email: email,
                specialty: specialty,
                username: username,
                mobileNumber: mobileNumber,
                status: status
            };
        }

        else{
            let profileImage =  req.file.originalname;
            updatedValue = {
                fullName: fullName,
                email: email,
                specialty: specialty,
                username: username,
                mobileNumber: mobileNumber,
                profileImage: profileImage,
                status: status
            };
        }

            const  updateValue = await Doctor.findByIdAndUpdate(userID,updatedValue).then(() => {
                res.json({status:200, message:'successfully updated'})
            }).catch((err) => {
                res.json({status:400, error:err})
            })
    }
    catch(err){
        console.log(err);
    }

})


// Sign-in
router.post("/signin", (req, res, next) => {
    let getUser;
    Doctor.findOne({
        email: req.body.email
    }).then(user => {
        if (!user) {
            return res.status(401).json({
                message: "Authentication failed"
            });
        }
        getUser = user;
        return bcrypt.compare(req.body.password, user.password);
    }).then(response => {
        if (!response) {
            return res.status(401).json({
                message: "Authentication failed"
            });
        }
        let jwtToken = jwt.sign({
            email: getUser.email,
            userId: getUser._id
        }, "X7ZUG_hmbC58ZCUCko1usvKMVCVwNKMC-XCcNX_zXh3EwYFSz6dxCAOJ3w885nqmrZNVujk-TqyNXOCu1MXg1v8y28hil_sQTLxKOtNq-w3qS1yTcFuXVSoiJEpYrACAevY98rI53NTp3ki-uWjUVayGNi16_pRpWwfzMhYHUyp-AX9NnbFSwwelYgZmjzoxqXe0bjgDZBLVUiU9-Vge8NO4tXJaZwrWQ5N9zIjAbyieuh4lXHUB1_UdMY9E5BN6Cxpu9rBBNOHK6We2BmEcQHfs7uK7FB0jl7R8xWrGwRchHuGIqwagHPXTKYYuAMNRXfb2TgR1rY8i5ofX0_RlwQ", {
            expiresIn: 3600
        });
        res.status(200).json({
            token: jwtToken,
            expiresIn: 3600,
            msg: getUser
        });
    }).catch(err => {
        return res.status(401).json({
            message: "Authentication failed"
        });
    });
});


router.route("/:doctorID").delete((req,res) => {

    const doctorID = req.params.doctorID;

    Doctor.findByIdAndDelete(doctorID).then(() => {
        res.json({status:200, message:'successfully deleted'})
    }).catch((err) => {
        res.json({err});
    })

})




module.exports = router;
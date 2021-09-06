const router = require('express').Router();
const Receptionist = require('../modals/Receptionist');
const Appointment = require('../modals/Appointment');
const jwt = require("jsonwebtoken");
require('dotenv').config();
const bcrypt = require("bcrypt");
const validator = require("../Auth/validator");
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

const storage = multer.diskStorage({
    destination: './uploads/receptionist',
    filename: function (req, file, callback){
        const imageID = uuidv4();
        const uploadName = imageID+file.originalname;
        callback(null, uploadName);
    }

});

const upload = multer({storage:storage});

router.post("/register", upload.single('profileImage'),async (req,res) => {

    try{
    let employeeID = req.body.employeeID;
    let username = req.body.username;
    let mobileNumber = req.body.mobileNumber;
    let profileImage =  req.file.filename;
    let password = req.body.password;

    const isExisting = await Receptionist.findOne({"employeeID": employeeID});

    if (isExisting) {
        res.json({status:401, message:'user already exist'})
    } else {
        const salt = await bcrypt.genSalt();
        const hash = await bcrypt.hash(password, salt);
        const user = new Receptionist({

            employeeID: employeeID,
            username: username,
            mobileNumber: mobileNumber,
            profileImage: profileImage,
            password: hash
        });

        user.save().then(() => {
            res.json({status:201, message:'user registered'})
        }).catch((err) => {
            res.json({status:400,message:err})
        })
    }
    }
    catch(err){
        console.log(err);
    }

})

router.post("/login", async(req, res) => {
    try {
        let employeeID = req.body.employeeID;
        let password = req.body.password;

        const user = await Receptionist.findOne({'employeeID': employeeID});

        if (user) {
            const auth = await bcrypt.compare(password, user.password);
            if (auth) {
                const accessToken = jwt.sign({user}, process.env.ACCESS_TOKEN_SECRET_KEY);
                // res.header('auth_token',accessToken).send(accessToken);
                res.json({status: 200, token: accessToken, user: user});
            } else {
                res.json({status: 401, message: 'unauthorized'})
            }
        } else {
            res.json({status: 404, message: 'user does not exist.'})
        }
    }catch (err) {
        res.json({error: err})
    }

})

router.get("/:userID", validator, async(req, res) => {

    let userID = req.params.userID;

    const user = await Receptionist.findOne({_id:userID});

    if(user) {

        res.json({status: 200, user: user});
    }

    else{
            res.json({status:404, message:'not found'})
        }

})

router.put("/update/:userID", async (req,res) => {

    let updateValue;
    try {
        let userID = req.params.userID;
        let username = req.body.username;
        let mobileNumber = req.body.mobileNumber;
        let oldPassword = req.body.oldPassword;
        let newPassword = req.body.newPassword;

        const user = await Receptionist.findOne({_id: userID});

        if (oldPassword) {
            const isTrue = await bcrypt.compare(oldPassword, user.password);
            let updatedValue = null;

            if (isTrue) {
                const salt = await bcrypt.genSalt();
                const hash = await bcrypt.hash(newPassword, salt);

                if (req.file) {
                    let profileImage =  req.file.filename;
                    updatedValue = {

                        username: username,
                        mobileNumber: mobileNumber,
                        profileImage: profileImage,
                        password: hash
                    };
                } else {
                    updatedValue = {

                        username: username,
                        mobileNumber: mobileNumber,
                        password: hash
                    };
                }

                const updateValue = await Receptionist.findByIdAndUpdate(userID, updatedValue).then(() => {
                    res.json({status: 200, message: 'successfully updated'})
                }).catch((err) => {
                    res.json({status: 400, error: err})
                })

            } else {
                res.json({status: 401, message: 'Incorrect Password'})
            }
        } else {
            let updatedValue;

            if (req.file) {
                let profileImage =  req.file.filename;
                updatedValue = {
                    username: username,
                    profileImage: profileImage,
                    mobileNumber: mobileNumber,
                };
            } else {
                updatedValue = {
                    username: username,
                    mobileNumber: mobileNumber,
                };
            }

            updateValue = await Receptionist.findByIdAndUpdate(userID, updatedValue).then(() => {
                res.json({status: 200, message: 'successfully updated'})
            }).catch((err) => {
                res.json({status: 400, error: err})
            })

        }


    } catch (err) {
        console.log(err);
    }

})

router.get("/appointments/current", async(req, res) => {

    const appointments = await Appointment.find({'approvedStatus': true}).populate('patient').populate('doctor').then((appointments) => {
        res.json({appointments:appointments});
    }).catch((err) => {
        res.json({err:err});
    })

})

router.get("/appointments/view/:ID", async(req, res) => {

    let ID = req.params.ID;
    const appointments = await Appointment.find({_id: ID}).populate('patient').populate('doctor').then((appointment) => {
        res.json({appointment});
    }).catch((err) => {
        res.json({err:err});
    })

})

router.get("/appointments/pending", async(req, res) => {

    const appointments = await Appointment.find({'approvedStatus': false}).populate('patient').populate('doctor').then((appointments) => {
        res.json({appointments:appointments});
    }).catch((err) => {
        res.json({err:err});
    })

})

module.exports = router;

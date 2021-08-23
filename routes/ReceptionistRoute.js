const router = require('express').Router();
const Receptionist = require('../modals/Receptionist');
const Appointment = require('../modals/Appointment');
const jwt = require("jsonwebtoken");
require('dotenv').config();
const bcrypt = require("bcrypt");


function auth(req,res,next){
    const authToken = req.header('auth_token');
    if (!authToken) return  res.json({status: 401, message: 'unauthorized'})
        try {
            req.user = jwt.verify(authToken, process.env.ACCESS_TOKEN_SECRET_KEY);
            next();
        } catch (e) {
            res.json({status: 401, message: 'unauthorized'})
        }
}


router.post("/register", async (req,res) => {

    try{
    let employeeID = req.body.employeeID;
    let username = req.body.username;
    let mobileNumber = req.body.mobileNumber;
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

router.get("/:userID", auth, async(req, res) => {

    let userID = req.params.userID;

    const user = await Receptionist.findOne({_id:userID});

    if(user) {

        res.json({status: 200, user: user});
    }

    else{
            res.json({status:404, message:'not found'})
        }

})

router.put("/update/:userID",auth, async (req,res) => {

    try{

        let userID = req.params.userID;
        let username = req.body.username;
        let mobileNumber = req.body.mobileNumber;
        let oldPassword = req.body.oldPassword;
        let newPassword = req.body.newPassword;

        const user = await Receptionist.findOne({_id:userID});

        if(oldPassword){
            const isTrue = await bcrypt.compare(oldPassword, user.password);

            if (isTrue) {
                const salt = await bcrypt.genSalt();
                const hash = await bcrypt.hash(newPassword, salt);
                const updatedValue = {

                    username: username,
                    mobileNumber: mobileNumber,
                    password: hash
                };

                const  updateValue = await  Receptionist.findByIdAndUpdate(userID,updatedValue).then(() => {
                    res.json({status:200, message:'successfully updated'})
                }).catch((err) => {
                    res.json({status:400, error:err})
                })

            }
            else {
                res.json({status:401, message:'Incorrect Password'})
            }
        }
        else{
            const updatedValue = {
                username: username,
                mobileNumber: mobileNumber,
            };

            const  updateValue = await  Receptionist.findByIdAndUpdate(userID,updatedValue).then(() => {
                res.json({status:200, message:'successfully updated'})
            }).catch((err) => {
                res.json({status:400, error:err})
            })

        }


    }
    catch(err){
        console.log(err);
    }

})

router.get("/appointments/pending", async(req, res) => {

    const appointments = await Appointment.find({'approvedStatus': true}).then((appointments) => {
        res.json({appointments:appointments});
    }).catch((err) => {
        res.json({err:err});
    })

})

module.exports = router;

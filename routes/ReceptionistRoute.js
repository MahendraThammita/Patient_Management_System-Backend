const router = require('express').Router();
const Receptionist = require('../modals/Receptionist');


router.post("/register", async (req,res) => {

    let employeeID = req.body.employeeID;
    let username = req.body.username;
    let mobileNumber = req.body.mobileNumber;
    let password = req.body.password;

    const isExisting = await Receptionist.findOne({"employeeID": employeeID});

    if (isExisting){
        return res.status(401).json("User already exist!");
    }
    else{
        const user = new Receptionist({

            employeeID: employeeID,
            username: username,
            mobileNumber: mobileNumber,
            password: password
        });

        user.save().then(() => {
            return res.status(201).json("User registered");
        }).catch((err) => {
            return res.status(400).json("Something went wrong");
        })
    }

})
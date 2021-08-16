const router = require('express').Router();
const Receptionist = require('../modals/Receptionist');
const bcrypt = require("bcrypt");


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
        const salt = await bcrypt.genSalt();
        const hash = await bcrypt.hash(password, salt);
        const user = new Receptionist({

            employeeID: employeeID,
            username: username,
            mobileNumber: mobileNumber,
            password: hash
        });

        user.save().then(() => {
            return res.status(201).json("User registered");
        }).catch((err) => {
            return res.status(400).json("Something went wrong");
        })
    }

})

router.post("/login", async(req, res) => {

    let employeeID = req.body.employeeID;
    let password = req.body.password;

    const user = await Receptionist.findOne({'employeeID':employeeID});

    if(user){
        const auth = await bcrypt.compare(password, user.password);
        if(auth){
            return res.status(200).json("User found");
        }
        else{
            return res.status(401).json("invalid credentials!");
        }
    }
})

module.exports = router;
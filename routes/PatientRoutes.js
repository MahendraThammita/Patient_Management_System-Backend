const router = require('express').Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

//importing modals
const Patient = require('../modals/Patient');

// Log-in
router.post("/signin", (req, res, next) => {
    let getUser;
    Patient.findOne({
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
            expiresIn: "1h"
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


//patient register
router.post('/reg',async (req,res) =>{
    const {
        fullName,
        suffix,
        age,
        dateOfBirth,
        profession,
        address,
        phone,
        email,
        password,
        guardianName,
        guardianPhone,
        guardianEmail
    } = req.body

    const salt = await bcrypt.genSalt();
    const pass = await bcrypt.hash(password, salt);
 
    try{
        const data = await Patient.create({
            fullName: fullName,
            suffix: suffix,
            age:age,
            dateOfBirth:dateOfBirth,
            profession:profession,
            address:address,
            phone:phone,
            email:email,
            password:pass,
            guardianName:guardianName,
            guardianPhone:guardianPhone,
            guardianEmail:guardianEmail
         })

        //  console.log(data)
         res.status(200)
         res.json({"message" : "ok"})
    }catch(err){
        console.log(err)
        res.json({error: err})
    }
    // console.log(pass)
 })

module.exports = router;
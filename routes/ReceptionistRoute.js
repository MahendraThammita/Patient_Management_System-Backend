const router = require('express').Router();
const Receptionist = require('../modals/Receptionist');
const bcrypt = require("bcrypt");


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

    let employeeID = req.body.employeeID;
    let password = req.body.password;

    const user = await Receptionist.findOne({'employeeID':employeeID});

    if(user){
        const auth = await bcrypt.compare(password, user.password);
        if(auth){
          res.json({status:200, user:auth})
        }
        else{
           res.json({status:401, message:'unauthorized'})
        }
    }
    else{
        res.json({status:404, message:'user does not exist.'})
    }
})

router.put("/update/:userID", async (req,res) => {

    try{

        let userID = req.params.userID;
        let username = req.body.username;
        let mobileNumber = req.body.mobileNumber;
        let oldPassword = req.body.oldPassword;
        let newPassword = req.body.newPassword;

        const user = await Receptionist.findOne({_id:userID});
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
    catch(err){
        console.log(err);
    }

})

module.exports = router;

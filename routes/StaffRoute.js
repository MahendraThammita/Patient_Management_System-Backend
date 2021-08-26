const router = require('express').Router();
const jwt = require("jsonwebtoken");
require('dotenv').config();
const bcrypt = require("bcrypt");
const multer = require('multer');
const Nurse = require('../modals/Nurse');
const LabStaff = require('../modals/LabStaff');
const { v4: uuidv4 } = require('uuid');

const storage = multer.diskStorage({
    destination: './uploads/staff',
    filename: function (req, file, callback){
        const imageID = uuidv4();
        const uploadName = imageID+file.originalname;
        callback(null,  uploadName);
    }

});

const upload = multer({storage:storage});


router.post("/register", async (req,res) => {


    let Fname = req.body.firstName;
    let Lname = req.body.lastName;
    let NIC = req.body.NIC;
    let email = req.body.email;
    let mobileNumber = req.body.mobileNumber;
    let password = req.body.password;
    // let profileImage =  req.file.filename;
    let role = req.body.role;

    if (role === 'Nurse' ){
        const isExisting = await Nurse.findOne({'nic': NIC});
        if (isExisting){
            res.json({status:400, message:'User already exist'})
        }
        else{
            const salt = await bcrypt.genSalt();
            const hash = await bcrypt.hash(password, salt);
            const staff = new Nurse({

                Fname: Fname,
                Lname: Lname,
                nic: NIC,
                email: email,
                mobileNumber: mobileNumber,
                password: hash,
                // profileImage: profileImage,

            });

            staff.save().then((staff) => {
                res.json({status:201, staff:staff})
            }).catch((err) => {
                res.json({status:400, message:err})
            })
        }
    }
    else if (role === 'labStaff'){
        const isExisting = await LabStaff.findOne({'nic': NIC});
        if (isExisting){
            res.json({status:400, message:'User already exist'})
        }
        else{
            const salt = await bcrypt.genSalt();
            const hash = await bcrypt.hash(password, salt);
            const staff = new LabStaff({

                Fname: Fname,
                Lname: Lname,
                nic: NIC,
                email: email,
                mobileNumber: mobileNumber,
                password: hash,
                // profileImage: profileImage,

            });

            staff.save().then((staff) => {
                res.json({status:201, staff:staff})
            }).catch((err) => {
                res.json({status:400, message:err})
            })
        }
    }

})

router.post("/login", async(req, res) => {
    try {
        let NIC = req.body.NIC;
        let password = req.body.password;

        const user = await Nurse.findOne({'nic': NIC});

        if (user) {
            const auth = await bcrypt.compare(password, user.password);
            if (auth) {
                const accessToken = jwt.sign({user}, process.env.ACCESS_TOKEN_SECRET_KEY);
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




module.exports = router;
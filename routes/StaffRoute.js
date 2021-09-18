const router = require('express').Router();
const jwt = require("jsonwebtoken");
require('dotenv').config();
const bcrypt = require("bcrypt");
const multer = require('multer');
const Nurse = require('../modals/Nurse');
const SupportStaffMemberRole = require('../modals/SupportStaffMemberRole')
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

    console.log("inside reg")

    let Fname = req.body.firstName;
    let Lname = req.body.lastName;
    let NIC = req.body.NIC;
    let email = req.body.email;
    let mobileNumber = req.body.mobileNumber;
    let password = req.body.password;
    // let profileImage =  req.file.filename;
    let role = req.body.role;

    console.log("Fname" , req.body);
    console.log("Fname" , Fname);


    if (role === 'Nurse' ){0000000
        const isExisting = await Nurse.findOne({'nic': NIC});
        if (isExisting){
            console.log("exist nurse")
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
                const staffRole = new SupportStaffMemberRole({
                    Role:role,
                    MemberId:staff.id,
                    userName:staff.email
                });
                staffRole.save().then((staffRole) => {
                    res.json({status:201, staff:staff})
                }).catch((err) => {
                    res.json({status:400, message:err})
                })
                
            }).catch((err) => {
                console.log("Error : " , err)
                res.json({status:400, message:err})
            })
        }
    }
    else if (role === 'Laboratory Staff'){
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
                const staffRole = new SupportStaffMemberRole({
                    Role:role,
                    MemberId:staff.id,
                    userName:staff.email
                });
                staffRole.save().then((staffRole) => {
                    res.json({status:201, staff:staff})
                }).catch((err) => {
                    res.json({status:400, message:err})
                })
            }).catch((err) => {
                res.json({status:400, message:err})
            })
        }
    }

})

router.post("/login", async(req, res) => {
    try {
        let userName = req.body.userName;
        let password = req.body.password;

        const userRole = await SupportStaffMemberRole.findOne({'userName': userName});
        if (userRole) {
            let user;
            if(userRole.Role === "Nurse"){
                user = await Nurse.findOne({'email': userName});
            }
                
            else if(userRole.Role === "Laboratory Staff"){
                user = await LabStaff.findOne({'email': userName});
            }
                
            if (user) {
                const auth = await bcrypt.compare(password, user.password);
                if (auth) {
                    const accessToken = jwt.sign({user}, process.env.ACCESS_TOKEN_SECRET_KEY);
                    res.json({status: 200, token: accessToken, user: user , Role: userRole.Role});
                } else {
                    res.json({status: 401, message: 'unauthorized'})
                }
            } else {
            res.json({status: 404, message: 'user does not exist.'})
            }
        } else {
            res.json({status: 404, message: 'user does not exist.'})
        }
        
    }catch (err) {
        console.log("Error : " , err);
        res.json({error: err})
    }

})




module.exports = router;
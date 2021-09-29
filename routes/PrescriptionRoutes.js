const router = require('express').Router();
const Appointment = require('../modals/Appointment');
const moment = require('moment');
const Prescription = require('../modals/Prescription');
const ObjectId = require('mongodb').ObjectID;
const authorize = require('../config/auth')
const pdfGenerator = require('pdfkit')
const fs = require('fs')
const InvoiceGenerator = require('../Asset/InvoiceGenerator')
const AWS = require('aws-sdk')
require('dotenv/config')
const LabTest = require('../modals/Test');

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_S3_K,
    secretAccessKey: process.env.AWS_S3_SK
})


router.post('/create', async (req, res) => {
    const {
        weight,
        height,
        sys_pressure,
        dis_pressure,
        specialRemarks_By_Nurse,
        fullName,
        previouslyVisited,
        age,
        patient,
        doctor,
        status,
        appointmentId
    } = req.body
    try {
        const data = await Prescription.create({

            weight: weight,
            height: height,
            bp_Systolic: sys_pressure,
            bp_Diastolic: dis_pressure,
            specialRemarks_By_Nurse: specialRemarks_By_Nurse,
            fullName: fullName,
            previouslyVisited: previouslyVisited,
            age: age,
            patient: patient,
            doctor: doctor,
            status: status,
        }).then(async (prescription) => {

            await Appointment.countDocuments({ _id: appointmentId }, async (err, count) => {
                if (count > 0) {
                    const updateValue = { prescription: prescription._id };
                    await Appointment.findByIdAndUpdate(appointmentId, updateValue).then(() => {
                        res.json({ status: 200, message: "ok" })
                    }).catch((err) => {
                        res.json({ status: 400, error: err })
                    })
                }
            });
        }).catch((err) => {
            res.json({ status: 400, message: err })
        })

    } catch (err) {
        console.log(err)
        res.json({ error: err })
    }
})


router.route('/update/prescription/:id').patch(authorize, async (req, res) => {

    try {
        const update = await Prescription.updateOne({ _id: req.params.id }, { $set: { docDesc: req.body.docDesc, startWeek: req.body.startWeek, endWeek: req.body.endWeek } }, {
            new: true
        })
        const updateApp = await Appointment.findOneAndUpdate({ _id: req.body.appId }, { tests: req.body.test, date: req.body.date, time: req.body.time })
        const appointment = await Appointment.findById(req.body.appId);
        
        //Creates lab-tests for each test in request
        let testsArray = req.body.test;
        if(testsArray.length > 0){
            testsArray.map(test => {
                test.map(async item => {
                    singleTestObject = {
                        testName : item,
                        Appointment : req.body.appId,
                        status : 'Speciman Pending',
                        doctor:appointment.doctor,
                        patient:appointment.patient,
                        date:req.body.date
                    }
                    await LabTest.create(singleTestObject);
                })
            })
        }

        if (req.body.createDoc === 'yes') {

            const filename = "Prescription-" + new Date(new Date).toISOString().slice(0,10) + "-" + req.body.billing.name + ".pdf"
            const appId = req.body.appId

            try {

                new InvoiceGenerator(req.body).generate()
                setTimeout(async() => {
                    fs.readFile('test2.pdf', async(err, data) => {
                        if (err) throw err;

                        const params = {
                            ACL: "public-read",
                            Bucket: process.env.BKT_NAME,
                            Key: filename,
                            Body: data
                        };

                        s3.upload(params, async(error, data) => {
                            if (error) throw error;

                            console.log(data);

                            const rdata = {
                                url: data.Location,
                                name: data.Key
                            }

                            const updateApp = await Appointment.updateOne({_id : appId},{$push : {reports : rdata}})

                            res.status(201).json({ "url": data.Location, "filename": data.Key })
                        })



                    })
                }, 1000);

            } catch (error) {
                console.log(error);
            }
        }

        //console.log(update);

        res.send(update)
    } catch (error) {
        res.send(error)
    }

})

module.exports = router;
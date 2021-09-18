var express = require('express');
var router = express.Router();
const authorize = require('../config/auth')
const axios = require('axios')
const qs = require('qs');
const { json } = require('body-parser');
const Doctor = require('../modals/Doctor');
const Appointment = require('../modals/Appointment');
const Patient = require('../modals/Patient');
const log = require('npmlog');
const Nurse = require('../modals/Nurse');
var ObjectId = require('mongoose').Types.ObjectId; 

//get report by user
router.route('/get/report/:id').get(authorize, async(req,res) =>{
    try {
        log.info("in the /get/patients")
        const report = await Appointment.find({patient : new ObjectId(req.params.id)}).select('reports')
        var repoList = []
        var atomRepo = []
        report.map(item =>{
            repoList.push(item.reports)
        })

        repoList.map(item =>{
            item.map(item2 =>{
                log.info(JSON.stringify(item2))
                atomRepo.push(item2)
            })
        })

        res.send(atomRepo)

    } catch (error) {
        log.error("check the /get/report/:id function")
        log.error(error)
    }
})




module.exports = router;
var express = require('express');
var router = express.Router();
const authorize = require('../config/auth')
const axios = require('axios')
const qs = require('qs');
const { json } = require('body-parser');
const Doctor = require('../modals/Doctor');
const Appointment = require('../modals/Appointmnet');
const Patient = require('../modals/Patient');


//get all doctor usernames from the datbase

router.route('/get-my-name').get(async(req, res, next) => {
    const data = await Doctor.find();
    //send the data to the user
    res.send(data) 
})

//get timeslots for a doctor
router.route('/get-timeslots/:id').get(async(req, res) => {
    if (req.params && req.params.id) {
        await Doctor.findById(req.params.id)
        .then(data => {
          res.status(200).send({ timeSlots: data.timeSlots });
        })
        .catch(error => {
          res.status(500).send({ error: error.message });
        });
      }
      

//get all pending appointments
router.route('/pending/:id').get(authorize,async(req,res)=>{

    try {
        const pendingApps = await Appointment.find({status : 'pending',approvedStatus : true, doctor : req.params.id}).populate('patient')

        res.send(pendingApps)
    } catch (error) {
        res.send(error)
    }

})


//get all declined appointments
router.route('/declined/:id').get(authorize,async(req,res)=>{

    try {
        const pendingApps = await Appointment.find({status : 'declined',approvedStatus : true, doctor : req.params.id}).populate('patient')

        res.send(pendingApps)
    } catch (error) {
        res.send(error)
    }

})


//get all finised appointments
router.route('/finished/:id').get(authorize,async(req,res)=>{

    try {
        const pendingApps = await Appointment.find({status : 'finished',approvedStatus : true, doctor : req.params.id}).populate('patient')

        res.send(pendingApps)
    } catch (error) {
        res.send(error)
    }

})

//get appointment by ID
router.route('/:id').get(authorize,async(req,res)=>{

    try {
        const pendingApps = await Appointment.findOne({_id : req.params.id}).populate('patient')

        res.json(pendingApps)
    } catch (error) {
        res.send(error)
    }

})

//add medication to the user
router.route('/medi/:pid').patch(authorize,async(req,res)=>{
    try {
        console.log(req.body.newMed);
        const resp = await Patient.updateOne({_id : req.params.pid},{$push : {medications : req.body.newMed}})
        res.status(201).send(resp)
    } catch (error) {
        res.send(error)
    }
})

//add reports to the appointment
router.route('/report/:aid').post(authorize,async(req,res)=>{
    try {
        console.log(req.body.newMed);
        const resp = await Appointment.updateOne({_id : req.params.aid},{$push : {reports : req.body.report}})
        res.status(201).send(resp)
    } catch (error) {
        res.send(error)
    }
})

//change the status of the appointment
router.route('/status/:aid').post(authorize,async(req,res)=>{
    try {
        //console.log(req.body.newMed);
        const resp = await Appointment.updateOne({_id : req.params.aid},{$set : {status : req.body.status}})
        res.send(resp)
    } catch (error) {
        res.send(error)
    }
})



//get appoinyment numbers
router.route('/count/:id').get(authorize,async(req,res)=>{

    try {
        const pendingApps = await Appointment.find({status : 'pending',approvedStatus : true, doctor : req.params.id}).count()

        const declinedApps = await Appointment.find({status : 'declined',approvedStatus : true, doctor : req.params.id}).count()

        const finishedApps = await Appointment.find({status : 'finished',approvedStatus : true, doctor : req.params.id}).count()

        res.json({"pen" : pendingApps, "fin" : finishedApps, "dec" : declinedApps})
    } catch (error) {
        res.send(error)
    }

})

module.exports = router;
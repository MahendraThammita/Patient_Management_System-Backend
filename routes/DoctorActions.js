var express = require('express');
var router = express.Router();
const authorize = require('../config/auth')
const axios = require('axios')
const qs = require('qs');
const { json } = require('body-parser');
const Doctor = require('../modals/Doctor');


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
})



module.exports = router;
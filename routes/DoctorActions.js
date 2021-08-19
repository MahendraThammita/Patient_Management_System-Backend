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

module.exports = router;
var express = require('express');
var router = express.Router();
const keycloak = require('../config/keycloak-config').getKeycloak()
const axios = require('axios')
const qs = require('qs');
const { json } = require('body-parser');

router.route('/user-profile/:id').get(authorize, (req, res, next) => {
    userSchema.findById(req.params.id, (error, data) => {
        if (error) {
            return next(error);
        } else {
            res.status(200).json({
                msg: data
            })
        }
    })
})

module.exports = router;
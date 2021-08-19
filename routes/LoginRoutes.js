var express = require('express');
var router = express.Router();
const keycloak = require('../config/keycloak-config').getKeycloak()
const axios = require('axios')
const qs = require('qs');
const { json } = require('body-parser');

router.get('/doctor/user-login',async function(req, res){

    const resp = await axios({
        method: 'post',
        url: 'http://keycloak-1307686978.us-east-1.elb.amazonaws.com/auth/realms/spm/protocol/openid-connect/token',
        data: qs.stringify({
            grant_type: 'password',
            client_id: 'spm',
            client_secret : '63fd9f4d-a693-40cb-acf1-2ff729047d58',
            username : 'admin',
            password : 'admin'
        }),
        headers: {
          'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
        }
      })

    console.info('userlogin hitted');
      //res.send(JSON.stringify(resp))
      const access_token = resp.data.access_token
      const refresh_token = resp.data.refresh_token

      res.json({"access_token" : access_token, "refresh_token" : refresh_token,"user_type" : "doctor"})
      console.log(resp.data.access_token);
});

module.exports = router;
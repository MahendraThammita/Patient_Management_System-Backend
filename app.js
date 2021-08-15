const express = require('express')
const app = express()
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')
const router = express.Router({});
require('dotenv/config')

const PORT = process.env.PORT || 8090;

//Import Routes
const Health = require('./routes/HelathCheck')
// const TestR = require('./routes/test-controller')

//Middleware
// const keycloak = require('./config/keycloak-config.js').initKeycloak();
// app.use(keycloak.middleware());
app.use(bodyParser.json())
app.use(cors())

//routes
app.use('/',Health)
// app.use('/test',TestR)

//connecting to the database
mongoose.connect(
    process.env.MONGODB_URI,
    {useNewUrlParser: true , useUnifiedTopology:true},
    () =>{
        console.log("connected to the database")
    }
)

//server start
app.listen(PORT, () =>{
    console.log('server is up and runnig on port :' + PORT);
});
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const router = express.Router({});
require('dotenv/config');
dotenv.config();
const app = express();
const PORT = process.env.PORT || 8090;

//Import Routes
const Health = require('./routes/HelathCheck')
const ReceptionistRouter = require('./routes/ReceptionistRoute');
const DoctorRouter = require('./routes/DoctorRoute');
// const TestR = require('./routes/test-controller')

//Middleware
// const keycloak = require('./config/keycloak-config.js').initKeycloak();
// app.use(keycloak.middleware());
app.use(bodyParser.json())
app.use(cors())
app.use(express.static('uploads'))

//routes
app.use('/',Health)
// app.use('/test',TestR)
app.use('/receptionist', ReceptionistRouter);
app.use('/doctor', DoctorRouter);

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
    console.log('server is up and running on port :' + PORT);
});

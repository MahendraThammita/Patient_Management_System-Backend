const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const router = express.Router({});
const app = express();

require('dotenv/config')
const session = require('express-session')
var memoryStore = new session.MemoryStore();
app.use(session({ secret: '63fd9f4d-a693-40cb-acf1-2ff729047d58', resave: false, saveUninitialized: true, store: memoryStore }))
const keycloak = require('./config/keycloak-config.js').initKeycloak(memoryStore);

const PORT = process.env.PORT || 8090;

//Import Routes
const Health = require('./routes/HelathCheck')
const TestR = require('./routes/test-controller')
const DoctorActions = require('./routes/DoctorActions')
const ReceptionistRouter = require('./routes/ReceptionistRoute');
const DoctorRouter = require('./routes/DoctorRoute');
const PatientRoute = require('./routes/PatientRoutes');
const AppointmentRoute = require('./routes/AppointmentsRoutes');
// const TestR = require('./routes/test-controller')

//Middleware
app.use(cors())
app.use(keycloak.middleware());
app.use(bodyParser.json())


//routes
app.use('/',Health)
app.use('/test',TestR)
app.use(express.static('uploads'))
app.use('/doctorA',DoctorActions)
app.use('/receptionist', ReceptionistRouter);
app.use('/doctor', DoctorRouter);
app.use('/patient', PatientRoute);
app.use('./appointment', AppointmentRoute);

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

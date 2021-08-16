const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const router = express.Router({});

dotenv.config();
const app = express();
app.use(cors());
app.use(bodyParser.json);

const ReceptionistRouter = require('./routes/ReceptionistRoute');

app.use('/receptionist', ReceptionistRouter);


const PORT = process.env.PORT || 8090;

mongoose.connect(
    process.env.MONGODB_URI,
    {useNewUrlParser: true , useUnifiedTopology:true},
    () =>{
        console.log("connected to the database")
    }
)

app.listen(PORT , () =>{
    console.log('Development Server is Up and Running on Port ' , PORT);
})
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');

dotenv.config();
const app = express();
app.use(cors());
app.use(bodyParser.json);

const PORT = process.env.PORT || 8090;
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI , {
    useCreateIndex:true,
    useNewUrlParser:true,
    useUnifiedTopology: true,
    useFindAndModify:false
} , (err) => {
    if(err){
        console.log('Database Error : ' , err.message);
    }
})

mongoose.connection.once('open' , () => {
    console.log('DB Connection Stablished Successfuly.');
})

app.listen(PORT , () =>{
    console.log('Development Server is Up and Running on Port ' , PORT);
})
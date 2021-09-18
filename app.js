const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const router = express.Router({});
const app = express();
const http = require('http')
const { Server } = require('socket.io')
const log = require('npmlog')

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
const StaffRoute = require('./routes/StaffRoute');
const Uploads = require('./routes/Uploads');
const Chat = require('./modals/Chat.js');
const Doctor = require('./modals/Doctor.js');
const Nurse = require('./modals/Nurse');
// const TestR = require('./routes/test-controller')

//Middleware
app.use(cors())
app.use(keycloak.middleware());
app.use(bodyParser.json())

//socket.io implementation
const server = http.createServer(app)

//========================================== START OF socket.io chat feature implementation DNT ========================================

const io = new Server(server,{
    cors : {
        origin : "http://localhost:3000",
        methods : ["GET","POST"]
    }
})

io.on("connection", (socket) =>{
    log.info("SOCKET_CONN",`user connected ${socket.id}`);

    io.on("disconnect", () =>{
        log.info("SOCKET_DISCONN","User disconnected" , socket.id);
    })

    socket.on("join_room", async(data) =>{
        socket.join(data.room_id)
        log.info("SOCKT_JOIN_ROOM",`user with id: ${socket.id} joined room ${data.room_id}`)

        const saveChat = await Chat.create({
            roomId : data.room_id,
            user1 : data.user1,
            user2 : data.user2
        }) 

        log.info(saveChat)
        const updateUser1 = await Doctor.findOneAndUpdate({fullName : data.user1},{$push : {recentChats : saveChat._id}})
        const updateUser2 = await Doctor.findOneAndUpdate({fullName : data.user2},{$push : {recentChats : saveChat._id}})
    })

    //nurse join room

    socket.on("join_room_nurse", async(data) =>{
        socket.join(data.room_id)
        log.info("SOCKT_JOIN_ROOM",`user with id: ${socket.id} joined room ${data.room_id}`)

        const saveChat = await Chat.create({
            roomId : data.room_id,
            user1 : data.user1,
            user2 : data.user2,
            userType : data.userType
        }) 

        log.info(saveChat)
        const updateUser1 = await Doctor.findOneAndUpdate({fullName : data.user1},{$push : {recentChats : saveChat._id}})
        const updateUser2 = await Nurse.findOneAndUpdate({Fname : data.user2},{$push : {recentChats : saveChat._id}})
    })

    socket.on("join_room_recent", async(data) =>{
        socket.join(data.room_id)
        log.info("SOCKT_JOIN_ROOM",`user with id: ${socket.id} joined room ${data.room_id}`)

        
    })

    socket.on("send_message", async(data) =>{
        log.info(JSON.stringify(data))
        const updateMessage = await Chat.findOneAndUpdate({_id : data.chatThId},{$push : {message : {message : data.message, time : data.time, author : data.name}}})

        socket.to(data.room).emit("receive_message",data)
    })
})

//========================================== END OF socket.io chat feature implementation DNT ========================================


//routes
app.use('/',Health)
app.use('/test',TestR)
app.use(express.static('uploads'))
app.use('/doctorA',DoctorActions)
app.use('/receptionist', ReceptionistRouter);
app.use('/doctor', DoctorRouter);
app.use('/patient', PatientRoute);
app.use('/appointment', AppointmentRoute);
app.use('/staff', StaffRoute);
app.use('/upload', Uploads);

//connecting to the database
mongoose.connect(
    process.env.MONGODB_URI,
    {useNewUrlParser: true , useUnifiedTopology:true},
    () =>{
        console.log("connected to the database")
    }
)

//server start
server.listen(PORT, () =>{
    console.log('server is up and running on port :' + PORT);
});

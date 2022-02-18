const express = require('express')
const app = express()
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const routesUrls = require('./routes/routes')
const addUsersRouter = require('./routes/desktop-app/addUsers');
const getUsersRouter = require('./routes/desktop-app/getUsers');
const getOrgId = require('./routes/desktop-app/getOrgId');
const createExam = require('./routes/desktop-app/createExam');
const viewExam = require('./routes/desktop-app/viewExam');
const answersheet = require('./routes/desktop-app/getAnswersheet')
const uploadResult = require('./routes/desktop-app/uploadResult')
const viewResult = require('./routes/desktop-app/viewResult')
const deleteExam = require('./routes/desktop-app/deleteExam')
const editExam = require('./routes/desktop-app/editExam')
const forgotpassword =require('./routes/desktop-app/forgotpassword')
const getProfile = require('./routes/desktop-app/getProfile')
const cors = require('cors')
const bodyParser = require('body-parser')



dotenv.config()
const connectDB = async() => {
       await mongoose.connect(process.env.DATABASE_ACCESS,{
        useUnifiedTopology: true,
        useNewUrlParser: true, 
        useCreateIndex: true,
        
}, ()=> console.log('Database connected'))
}
mongoose.set('useFindAndModify', false);

app.use(bodyParser.json({limit: '10mb' }));
app.use(express.urlencoded({limit: '10mb', extended: false }));
app.use(express.json())
app.use(cors())

app.use('/forgotpassword',forgotpassword)
app.use('/editExam',editExam)
app.use('/deleteExam', deleteExam);
app.use('/app', routesUrls)
app.use("/addUser",addUsersRouter);
app.use("/getUsers",getUsersRouter);
app.use("/getOrgId", getOrgId);
app.use("/createExam", createExam);
app.use("/viewExam", viewExam);
app.use("/AnswerSheet", answersheet);
app.use("/UploadResult",uploadResult)
app.use("/ViewResult",viewResult)
app.use("/getProfile",getProfile)
app.listen(5000, () => console.log("Server is running"))

connectDB();
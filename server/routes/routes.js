const express = require('express')
const router = express.Router()
const signUpTemplateCopy = require('../models/SignUpModels')
const users = require('../models/UserModels');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const fs = require('fs');
const { MongoClient } = require('mongodb');
const nodemailer = require('nodemailer');
const generator = require('generate-password');

router.use(bodyParser.json());
const dotenv = require('dotenv');
dotenv.config()



router.post('/signup',(request,response,next)=>{
    signUpTemplateCopy.countDocuments({ email: request.body.email }, (err, cnt) => {        
        if (err) {
            console.log(err);
        }
        else {
            if (cnt) {                        
                response.json({ "statusMessage": "Email Already Exist." });
            }
            else {
            const signedUpUser = new signUpTemplateCopy({
                firstname: request.body.firstname,
                lastname: request.body.lastname,
                email: request.body.email,       
                university: request.body.university,
                designation: request.body.designation,
                id: request.body.id,
                idName: request.body.idName,
                photo: request.body.photo,
                photoName: request.body.photoName
            });
            signUpTemplateCopy.create(signedUpUser)
            // details.save()
            .then((signedUpUser) => {
                console.log("Details entered into Database");
                response.statusCode = 200;
                response.setHeader('Content-Type', 'text/plain');
                response.json({ "statusMessage": "Details Has Been Sent To The Admin. Further Instructions Will Be Sent To Given Mail Id." });
            }).catch((err) => next(err))
        }
    }
         
    })
})



router.post('/signin', (req, res, next) => {
    
    console.log(req.body.admin_users.email + " "+req.body.admin_users.password)
    //{  $and: [{ email: { $eq: req.body.admin_users.email } }, { password: { $eq: req.body.admin_users.password } }] }
    var query = users.find({  $and: [{ email: { $eq: req.body.admin_users.email } }, { password: { $eq: req.body.admin_users.password } }] } );

    query.exec((err, someValue) => {    
        console.log(someValue);
        if (err) {
            next(err);
        }
        else {
            if (someValue.length) {
                console.log(someValue[0].role)
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({ "statusMessage": "Login Successful", "role": someValue[0].role, "email": someValue[0].email, "orgId": someValue[0].orgId});
            }
            else {
                res.status(401).send({ error: 'Incorrect Credentials' });
            }
        }
    })
});

router.get("/dashboard",(req, res) => {
        // let cookie = Cookies.get()
        // console.log(cookie)
        signUpTemplateCopy.find({ "status": "pending" })
            .then((values) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(values);
            })
            .catch((err) => res.status(503).send({ error: "Server Unable to Process Data" }));
    });


    router.get("/accepted",(req, res) => {
        signUpTemplateCopy.find({ "status": "accepted" })
            .then((values) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(values);
            })
            .catch((err) => res.status(503).send({ error: "Server Unable to Process Data" }));
    });

    router.route("/rejected")
    .get((req, res) => {
        signUpTemplateCopy.find({ "status": "rejected" })
            .then((values) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(values);
            })
            .catch((err) => res.status(503).send({ error: "Server Unable to Process Data" }));
    });

    router.post("/confirmation",(req, res) => {
        let password = generator.generate({
            length: 10,
            uppercase: true,
            numbers: false,
            symbols: false
        });
        console.log("/confirmation")
        signUpTemplateCopy.find({ "email":  req.body.details.email  })
            .then(data => {
                console.log(data[0]._id)
                 users.collection.find({ "email": { $in: [req.body.details.email]}}).count()
                    .then((countUserExist) => {

                        console.log(countUserExist);
                        if (countUserExist === 0) {
                            let queryData = [];
                            queryData.push({
                                "email": req.body.details.email,
                                "password": password,
                                "role": "admin",
                                "orgId": data[0]._id
                            });
                            users.collection.insertMany(queryData)
                                .then(() => {
                                    console.log("success");
                                    let transporter = nodemailer.createTransport({
                                        service: 'gmail',
                                        auth: {
                                            user: process.env.gmail,
                                            pass: process.env.password
                                        }
                                    });
                                    let mailOptions = {
                                        from: 'soes@gmail.com',
                                        to: req.body.details.email,
                                        subject: 'Application Accepted',
                                        text: `Your Organization has been successfully registered with our service. Here is your ID  ${req.body.details.email} and temporary password ${password} `
                                    }
                                    transporter.sendMail(mailOptions, (err, info) => {
                                        if (err) {
                                            console.log(err);
                                            res.statusCode = 502;
                                            res.send({ error: "Mail Not Sent" });
                                        }
                                        else {
                                            signUpTemplateCopy.findOneAndUpdate({ email: req.body.details.email }, { $set: { status: "accepted" } }, { new: true }, (error, doc) => {
                                                if (error) {
                                                    res.statusCode = 501;
                                                    res.send({ error: "Failed to Update DB" })
                                                }
                                                else {
                                                    console.log('email sent ' + info.response)
                                                    res.statusCode = 200;
                                                    res.setHeader('Content-Type', 'text/plain');
                                                    res.json({ "statusMessage": "Mail Sent Successfully" });
                                                }
                                            })

                                        }
                                    })
                                })
                                .catch((err) => {
                                    console.log("error");
                                    res.status(500).send({error : "first Server Side Error Occured !" })
                                })
                        } else {
                            res.status(200).json({ "statusMessage": "Organization with this email id already exists. Please login." })
                        }
                    });
            })
            .catch(err => res.status(500).send({ error: "last Server Side Error Occured !" }))


    });

    router.route("/rejection")
    .post((req, res) => {
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.gmail,
                pass: process.env.password
            }
        });
        let mailOptions = {
            from: 'soes@gmail.com',
            to: req.body.details.email,
            subject: 'Application Rejected', 
            text: `Your application has been Rejected. You may have uploaded incorrect files. Please upload correct documents for verification.`
        }
        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.log(err);
                res.statusCode = 502;
                res.send({ error: "Mail Not Sent" });
            }
            else {
                signUpTemplateCopy.findOneAndUpdate({ email: req.body.details.email }, { $set: { status: "rejected" } }, { new: true }, (error, doc) => {
                    if (error) {
                        res.statusCode = 501;
                        res.send({ error: "Failed to Update DB" })
                    }
                    else {
                        console.log('email sent ' + info.response)
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'text/plain');
                        res.json({ "statusMessage": "Mail Sent Successfully" });
                    }
                })

            }
        })

    });

    router.post("/contact",function(request, response) {
        
        let transport = nodemailer.createTransport({
        service : 'gmail',
        auth : {
            user: process.env.gmail,
            pass: process.env.password,
        },
    });

    let mailOptions = {
        from: request.body.email,
        to: 'soes.contactme.prahar@gmail.com',
        subject: `Contact Us: ${request.body.subject}`,
        text: `from: ${request.body.email} message: ${request.body.message}`,
    };
    let reply = {
        from: 'soes.contactme.prahar@gmail.com',
        to: request.body.email,
        subject: `Contact us`,
        text: `Dear ${request.body.name},</b> We have recieved your message. We will get in touch with you soon.`
    }
    console.log(mailOptions)
    
    transport.sendMail(reply, function(err,info) {
        if(err){
            console.log(err);
        }
        else{        
            transport.sendMail(mailOptions, function(err,info) {
                if(err){
                    console.log(err);                   
                }
                else{     
                             console.log('email sent ' + info.response)
                             response.setHeader('Content-Type', 'text/plain');
                             response.json({ "statusMessage": "Thanks for Contacting Us. We will get back to you shortly." });
                }
            })
            console.log('reply sent ' + info.response)                               
        }
    })
})


module.exports = router
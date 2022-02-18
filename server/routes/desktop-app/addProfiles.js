const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const express = require('express');
const profile = require('../../models/ProfileModels');

const path = require('path');
const generator = require('generate-password');
const mainRouter = express.Router();
const nodemailer = require('nodemailer');
mainRouter.use(bodyParser.json());
require('dotenv/config');

mainRouter.route("/")
    .post((req, res) => {
        let body = req.body.users;
        var passwords = generator.generateMultiple(body.length, {
            length: 10,
            uppercase: true,
            numbers: true,
        });
        let queryData  = [];
        let queryData2  = [];
        let emails = [];
        for(let i=0;i<body.length;i++) {
            emails.push(body[i].email);
            queryData.push({
                "email" : body[i].email,
                "password" : passwords[i],
                "role" : body[i].role,
                "orgId" : body[i].orgId  
            });
         
        }
        profile.collection.find({"_id" : {$in: [queryData[0].orgId]}}).count().then((data) => {
            console.log(data);
        }).catch((err) => {
            console.log(err);
        })
        user.collection.find({"email" : { $in: emails }}).count()
        .then((countUserExist) => {
            console.log(countUserExist);
            if(countUserExist===0) {
                forms.collection.insertMany(queryData2)
                .then(() => {
                    console.log("forms inserted");
                })
                .catch((err)=>{
                    console.log("forms error",err);
                })
                user.collection.insertMany(queryData)
                .then(() => {
                    console.log("success");
                    
                    for(let i=0;i<queryData.length;i++) {
                        let toEmail = queryData[i].email;
                        let password = queryData[i].password;

                        let transporter = nodemailer.createTransport({
                            service: 'gmail',
                            auth: {
                                user: process.env.gmail,
                                pass: process.env.password
                            }
                        });

                        let mailOptions = {
                            from: process.env.gmail,
                            to: toEmail,
                            subject: 'Your Login Details',
                           // text: `Your Organization has been successfully registered with our service. Here is your temporary password ${password} & This is your Registered MailId from your Organization  ${toEmail}`
                            html: `<html><head><style>table {font-family: arial, sans-serif;border-collapse: collapse;width: 50%;}td, th { border: 1px solid #dddddd;text-align: left;padding: 8px;} tr:nth-child(even) {background-color: #dddddd;}</style></head><body><div><h1>Your Organization has been successfully registered with our service.</h1><br> <p style="color:red;">Your login details is provided below:</p></div><table> <tr><th>Username</th><th>Password</th></tr><tr><td>${toEmail}</td><td>${password}</td></tr></html>`

                        }
                        transporter.sendMail(mailOptions, (err, info) => {
                            if (err) {
                                console.log(err);
                                res.status(200).json({"status" : "All Users Generated Successfully ! but mail not sent !"})
                            }
                            else {
                                console.log("Mail sent");
                                res.status(200).json({"status" : "All Users Generated Successfully !"})
                            }
                        })
                    }
                })
                .catch((err) => {
                    console.log("error");   
                    res.status(200).json({"status" : "Server Side Error Occured !"})
                })
            } else {
                res.status(200).json({"status" :countUserExist+" user/users from the file already exist, please check and generate again after updating the files !"})
            }
        }).catch((err) => {
            res.status(500);
        });
    });
module.exports = mainRouter;
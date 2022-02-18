const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const express = require('express');
const profile = require('../../models/ProfileModels');
const user = require('../../models/SignUpModels')
const path = require('path');
const generator = require('generate-password');
const mainRouter = express.Router();

mainRouter.use(bodyParser.json());



mainRouter.route("/faculty")
    .post((req, res) => {
        let query = profile.find( {email: { $eq: req.body.email }})
        // let query = user.find({"role" : "faculty"});
        query.exec((err,data) => {
            if(err) {
                res.status(500);
            } else {
                res.status(200).json({users : data});
            }
        })
    });
mainRouter.route("/student")
.post((req, res) => {
    console.log(req.body.email)
    let query = profile.find( {"email": { $eq: req.body.email }})
    // let query = user.find({"role" : "student"});
    query.exec((err,data) => {
        if(err) {
            res.status(500);
        } else {
            console.log("student data")
            res.status(200).json({users : data});
        }
    })
});
mainRouter.route("/admin")
    .post((req, res) => {
        console.log("/admins "+ req.body.email)
        let query = user.find( {email: { $eq: req.body.email }})
      // let query = user.find({"role" : "admin"});
        query.exec((err,data) => {
            if(err) {
                res.status(500);
            } else {
                console.log("admin data")
                res.status(200).json({users : data});
            }
        })
    });

module.exports = mainRouter;
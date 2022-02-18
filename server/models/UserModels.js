const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let userSchema = new Schema({
    email: {
        type: String,
        required:true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    university:{
        type: String,
        required: true
    },
    orgId: {
        type: String,
        required: true
    }
});

let users = mongoose.model('user', userSchema);

module.exports = users;

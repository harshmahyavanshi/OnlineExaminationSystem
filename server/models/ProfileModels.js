
const mongoose = require('mongoose')

const profile = new mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String, 
        required: true, 
        unique: true,
    },

    university: {
        type: String,
        required: true,
    },
    
    role: {
        type: String,
        required: true,
    },

    id: {
        type: String,
    },
    
    idName: {
        type: String,
       
    },

    photo: {
        type: String, 
    },

    photoName: {
        type: String,
    },

  

})

module.exports = mongoose.model('profile',profile)
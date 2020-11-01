const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        min: 4,
        max: 50,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        min: 6,
        max: 1024,
        unique:true
    },
    password:{
        type:String,
        min: 6,
        max: 2048,
        required:true
    },
    isAdmin:{
        type:Boolean,
        required:true
    },
    descreption: {
        type:String
    }
});

module.exports = mongoose.model("user",userSchema);
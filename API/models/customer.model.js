const mongoose = require("mongoose");

const customerModel = mongoose.Schema({
    firstname:{
        type:String,
        min: 2,
        max: 100,
        require:true
    },
    lastname:{
        type:String,
        min:2,
        max:100,
        require:true
    },
    street:{
        type:String,
        max:50
    },
    city:{
        type:String,
        max:100
    },
    bookcomment:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"bookcomment"
    }]
});
module.exports = mongoose.model("customer",customerModel);
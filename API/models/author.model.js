const mongoose = require("mongoose");

const authorModel = mongoose.Schema({
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
    books:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"book"
    }]
});
module.exports = mongoose.model("author",authorModel);
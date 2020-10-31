const mongoose = require("mongoose");

const nxbModel = mongoose.Schema({
    name:{
        type:String,
        min:1,
        max:1000,
        require:true
    },
    books:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"book"
    }]
});
module.exports = mongoose.model("nxb",nxbModel);
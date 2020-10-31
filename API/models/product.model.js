const mongoose = require("mongoose");

const bookModel = mongoose.Schema({
    title:{
        type:String,
        min:1,
        max:100,
        require:true
    },
    description:{
        type:String,
        min:1,
        max:200,
        require:true
    },
    long_description:{
        type:String,
        max:10000
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"author"
    },
    nxb:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"nxb"
    },
    bookcomment:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"bookcomment"
    }]
});
module.exports = mongoose.model("book",bookModel);
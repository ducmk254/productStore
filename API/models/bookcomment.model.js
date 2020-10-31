const { text } = require("body-parser");
const mongoose = require("mongoose");

const bookcommentModel = mongoose.Schema({
    comment:{
        type:String,
        min:1,
        require:true
    },
    time_ts:{
        type:Date,
        default:Date.now
    },
    book_rating:{
        type: Number,
        enum:[1,2,3,4,5],
        default: 5
    },
    book:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"book"
    },
    customer:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"customer"
    }
});
module.exports = mongoose.model("bookcomment",bookcommentModel);
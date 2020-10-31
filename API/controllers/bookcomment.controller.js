const indexModel = require("../models/index.model");

module.exports.getCommentList = async (req,res)=>{
    try {
        return res.status(200).json(
            await indexModel.bookcomment.find()
                                        .populate("customer")
                                        .populate("book")
        );
    } catch (error) {
        return res.status(400).json({message:"Error from Server during get comment list: " + error});
    }
}

module.exports.getComment = async ( req,res)=>{
    try {
        let comment = await indexModel.bookcomment.findById(req.params.bookcomment_id)
                                                  .populate("customer")
                                                  .populate("book");
        if(!comment) return res.stauts(403).json({message:"Book comment not found!!!"});
        return res.status(200).json(comment);
    } catch (error) {
        return res.status(400).json({message:"Error from Server during get comment by Id: " + error});
    }
}
module.exports.createComment = async (req,res)=>{
    try {
        let newComment = new indexModel.bookcomment({
            comment:req.body.comment,
            book:req.body.book_id,
            customer: req.body.customer_id,
            book_rating: req.body.book_rating
        });

        //save comment
        await newComment.save();
        //update customer:
        let customer = await indexModel.customer.findById(newComment.customer);
        if(customer) await customer.updateOne({$push:{bookcomment:newComment._id}});

        //update book:
        let book = await indexModel.book.findById(newComment.book);
        if(book) await book.updateOne({$push:{bookcomment:newComment._id}});

        return res.status(200).json(newComment);
    } catch (error) {
        return res.status(400).json({message:"Error from Server during create comment: " + error});
    }
}
module.exports.deleteComment = async (req,res)=>{
    try {
        let currentComment = await indexModel.bookcomment.findById(req.params.bookcomment_id);
        if(!currentComment) return res.status(403).json({message:"Comment not found!!!"});

        // remove bookcomment id from customer
        let currentCustomer = await indexModel.customer.findById(currentComment.customer);
        if(currentCustomer) await currentCustomer.updateOne({$pull:{bookcomment:currentComment._id}});

        /// remove bookcomment id from book
        let currentBook = await indexModel.book.findById(currentComment.book);
        if(currentBook) await currentBook.updateOne({$pull:{bookcomment:currentComment._id}});
        
        // remove bookcomment:
        await currentComment.deleteOne();
        return res.status(200).json({message:"Remove comment finished!!!"});
    } catch (error) {
        return res.status(400).json({message:"Error from Server during delete comment: " + error});
    }
}
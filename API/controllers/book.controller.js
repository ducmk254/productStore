const indexModel = require("../models/index.model");
module.exports.getBookList = async (req,res)=>{
    try {
        return res.status(200).json(await indexModel.book.find().populate("author").populate("nxb").populate("bookcomment"));
    } catch (error) {
        return res.status(400).json({message:"Error from Server during get book list :" + error});
    }
}
module.exports.getBook = async (req,res)=>{
    try {
        let book = await (await indexModel.book.findById(req.params.book_id).populate("author").populate("nxb").populate("bookcomment"));
        if(!book) return res.status(403).json({message:"Book not found!"});
        return res.status(200).json(book);
    } catch (error) {
        return res.status(400).json({message:"Error from Server during get a book  :" + error});
    }
}
module.exports.createABook = async (req,res)=>{
    try {
        let book = new indexModel.book({
            title: req.body.title,
            description: req.body.description,
            long_description: req.body.long_description,
            author:req.body.author_id,
            nxb: req.body.nxb_id
        });
        let author = await indexModel.author.findById(req.body.author_id);
        if(!author) return res.status(403).json({message:"Author doesn't exist"});
        await author.updateOne({books:{$push:book._id}});

        let nxb = await indexModel.nxb.findById(req.body.author_id);
        if(!nxb) {
            await author.updateOne({books:{$pull:book._id}});
            return res.status(403).json({message:"NXB doesn't exist"});
        }
        await nxb.updateOne({books:{$push:book._id}});

        await book.save();
        return res.status(200).json(book);
    } catch (error) {
        return res.status(400).json({message:"Error from Server during create a book  :" + error});
    }
}
module.exports.updateBook = async (req,res)=>{
    try {
        // find book:
        let changeBook = await indexModel.book.findById(req.params.book_id);
        if(!changeBook) return res.status(403).json({message:"Book not found!!!"});
        // update author:
        if(changeBook.author !== req.body.author_id){
            let currAuthor = await indexModel.author.findById(changeBook.author);
            if(currAuthor) {await currAuthor.updateOne({$pull:{books: changeBook._id}});}
            let currentAuthor = await indexModel.author.findById(req.body.author_id);
            if(!currentAuthor) {
                // await currAuthor.updateOne({books:{$push: changeBook._id}});
                return res.status(403).json({message:"Author not found!"});
            }
            
            await currentAuthor.updateOne({$push:{books:changeBook._id}});
        }
        //update nxb:
        if(changeBook.nxb !== req.body.nxb_id){
            let currNXB = await indexModel.nxb.findById(changeBook.nxb);
            if(currNXB) await currNXB.updateOne({$pull:{books: changeBook._id}});

            let currentNXB = await indexModel.nxb.findById(req.body.nxb_id);
            if(!currentNXB){
                // await currNXB.updateOne({books:{$push: changeBook._id}});
                return res.status(403).json({message:"NXB not found!"});
            }
            await currentNXB.updateOne({$push:{books:changeBook._id}});
        }
        //update book
        await changeBook.updateOne({
            title: req.body.title,
            description: req.body.description,
            long_description: req.body.long_description,
            author:req.body.author_id,
            nxb: req.body.nxb_id
        });
        return res.status(200).json({message:"Updated finish"});
    } catch (error) {
        return res.status(400).json({message:"Error from Server during change a book  :" + error});
    }
}

module.exports.deleteBook = async (req,res)=>{
    try {
         // find book:
         let changeBook = await indexModel.book.findById(req.params.book_id);
         if(!changeBook) return res.status(403).json({message:"Book not found!!!"});
         // update author:
        await indexModel.author.findByIdAndUpdate(changeBook.author,{$push:{books:changeBook._id}});
         //update nxb:
         await indexModel.nxb.findByIdAndUpdate(changeBook.nxb,{$push:{books:changeBook._id}});
         //update book
         await changeBook.deleteOne({
             title: req.body.title,
             description: req.body.description,
             long_description: req.body.long_description,
             author:req.body.author_id,
             nxb: req.body.nxb_id
         });
         return res.status(200).json({message:"Deleted finish"});
    } catch (error) {
        return res.status(400).json({message:"Error from Server during delete a book  :" + error});
    }
}
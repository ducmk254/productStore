const indexModel = require("../models/index.model");

module.exports.getAuthorList = async (req,res)=>{
    try {
        return res.status(200).json(
            await indexModel.author.find().populate("books")
        );
    } catch (error) {
        return res.status(400).json({message:"error get author list from Server : "+error});
    }
}

module.exports.getAAuthor = async (req,res)=>{
    try {
        console.log(req.params.author_id);
        let resultAuthor = await indexModel.author.findById(req.params.author_id)
                                            .populate("books");
        console.log(resultAuthor);
        if(!resultAuthor) return res.status(403).json({message:"Author not found !!!"});
        return res.status(200).json(resultAuthor);
    } catch (error) {
        return res.status(400).json({message:"error get author by Id from Server : "+error});
    }
}
module.exports.createAAuthor = async (req,res)=>{
    try {
        let author = new indexModel.author({
            firstname:req.body.firstname,
            lastname:req.body.lastname,
            street:req.body.street,
            city:req.body.city
        });
        await author.save();
        return res.status(200).json(author);
    } catch (error) {
        return res.status(400).json({message:"error create author from Server : "+error});
    }
}

module.exports.updateAuthor = async (req,res)=>{
    // input : information of Author and author_id:
    try {
        // search author by id:
        let updateAuthor = await indexModel.author.findById(req.params.author_id);
        if(!updateAuthor) return res.status(403).json({message:"Author not found !!!"});
        // save author and don't need update book table
        await updateAuthor.updateOne({
            firstname:req.body.firstname,
            lastname: req.body.lastname,
            street: req.body.street,
            city: req.body.city
        });
        return res.status(200).json({message:"Updated finish"});
    } catch (error) {
        res.status(400).json({message:"Cannot change information of author from Server: "+error});
    }
}

// han che toi da viec xoa author neu da co sach giao dich.
module.exports.deleteAuthor = async (req,res)=>{
    try {
        let deleteAuthor = await indexModel.author.findById(req.params.author_id);
        if(!deleteAuthor) return res.status(403).json({message:"Author not found !!!"});
        await deleteAuthor.deleteOne();
        return res.status(200).json({message:"deleted finish"});
    } catch (error) {
        res.status(400).json({message:"Cannot delete author from Server: "+error});
    }
}
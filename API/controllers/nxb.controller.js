const indexModel = require("../models/index.model");

module.exports.getNXBList = async (req,res)=>{
    try {
        return res.status(200).json(await indexModel.nxb.find().populate("books"));
    } catch (error) {
        res.status(400).json("Err form Server during get NXB list"+error);
    }
}
module.exports.getNXB = async ( req,res)=>{
    try {
        console.log(req.params.nxb_id)
        let nxb = await indexModel.nxb.findById(req.params.nxb_id).populate("books");
        if(!nxb) return res.status(403).json({message:"NXB not found!!!"});
        return res.status(200).json(nxb);
    } catch (error) {
        res.status(400).json({message: "Err form Server during get NXB by Id"+err});
    }
}

module.exports.createNXB = async(req,res)=>{
    try {
        let nxbNew = new indexModel.nxb({
            name: req.body.name
        });
        await nxbNew.save();
        return res.status(200).json(nxbNew);
    } catch (error) {
        res.status(400).json({message: "Err form Server during create NXB"+error});
    }
}
module.exports.editNXB = async(req,res)=>{
    try {
        let nxb = await indexModel.nxb.findById(req.params.nxb_id);
        if(!nxb) return res.status(403).json({message:"nxb not found !"});
        await nxb.updateOne({name:req.body.name});

        return res.status(200).json({message:"Updated finish!"});
    } catch (error) {
        res.status(400).json({message: "Err form Server during edit NXB"+error});
    }
}
module.exports.deleteNXB = async(req,res)=>{
    try {
        let nxb1 = await indexModel.nxb.findById(req.params.nxb_id);
        if(!nxb1) return res.status(403).json({message:"nxb not found !"});
        console.log(nxb1)
        for(book_id of nxb1.books){
            console.log(book_id)
            await indexModel.book.findByIdAndUpdate(book_id,{nxb:null});
        }
        await nxb1.deleteOne();
        return res.status(200).json({message:"Deleted finish!"});
    } catch (error) {
        res.status(400).json({message: "Err form Server during delete NXB"+error});
    }
}
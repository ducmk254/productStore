const indexModel = require("../models/index.model");

module.exports.getUserList = async (req,res)=>{
    try {
        return res.status(200).json(
            await indexModel.user.find().select("username").select("email").select("isAdmin").select("descreption")
        );
    } catch (error) {
        return res.status(400).json({
            message:"Error from Server during get user list"+ error
        });
    }
}
module.exports.getUser = async (req,res)=>{
    try {
        let user = await indexModel.user.findById(req.params.user_id);
        if(!user) return res.status(403).json({message:"User not found!!!"});
        return res.status(200).json(user);
    } catch (error) {
        return res.status(400).json({
            message:"Error from Server during get user"+ error
        });
    }
}

module.exports.createUser = async(req,res)=>{
    try {
        let newUser = new indexModel.user({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            isAdmin : req.body.isAdmin,
            descreption: req.body.descreption
        });
        await newUser.save();

        return res.status(200).json({message:newUser.username + " - created."});
    } catch (error) {
        return res.status(400).json({
            message:"Error from Server during create user"+ error
        });
    }
}

module.exports.changeUser = async (req,res)=>{
    try {
        let currentUser = await indexModel.user.findById(req.params.user_id);
        if(!currentUser) return res.status(403).json({message:"User not found"});
        await currentUser.updateOne({
            // information of user: 
            password: req.body.password,
            isAdmin: req.body.isAdmin,
            descreption: req.body.descreption
        });
        return res.status(200).json({message:"Update user finished"});
    } catch (error) {
        return res.status(400).json({
            message:"Error from Server during change user"+ error
        });
    }
}


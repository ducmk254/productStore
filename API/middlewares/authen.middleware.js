const indexModel = require("../models/index.model");
const jwt        = require("jsonwebtoken");
const joi        = require("@hapi/joi");
// check username or email exist ?
module.exports.checkDuplicateUserOrEmail = async (req,res,next)=>{
    try {
        // input: req.body.username and req.body.email
        let currentUser = await indexModel.user.findOne({username:req.body.username});
        if(!currentUser){
            let user = await indexModel.user.findOne({email:req.body.email});
            if(!user){
                next();
            }else{
                return res.status(302).json({message:"email exist !!!!!"});
            }
        }else{
            if(currentUser.email == req.body.email){
                return res.status(302).json({message:"username and email exist"});
            }
            return res.status(302).json({message:"Username exist"});
        }
    } catch (error) {
        return res.status(400).json({message:"error from server during check username or email exist " + error});
    }
}

// check isAdmin ?

module.exports.is_Admin = async ( req, res ,next)=>{
    try {
        let user = await indexModel.user.findById(req.body.user_id);
        if(user && user.isAdmin === true) {
            next();
        }else{
            return res.status(401).json({message:"Require admin login"});
        }
    } catch (error) {
        return res.status(400).json({message:"error from server during check isAdmin ? : "+ error});
    }
}

module.exports.verifyToken = async ( req,res,next)=>{
    let token = req.headers["auth-token"];
    if(!token) return res.status(400).json({message:"Access denided..."});

    jwt.verify(token,process.env.secret,(err,decoded)=>{
        if(err) return res.status(401).json({message:"unauthorized"});
        req.user_id = decoded.user_id;
        next();
    });
}

module.exports.validateUser = (req,res,next)=>{
    const userSchema = joi.object({
        username: joi.string().min(3).max(50).required(),
        email: joi.string().min(6).max(1024).required().email(),
        password: joi.string().min(6).max(2048).required(),
        isAdmin: joi.boolean().required(),
        descreption: joi.string()
    });
    let validate = userSchema.validate(req.body);
    // console.log(validate);
    if(validate.hasOwnProperty("error") == true) {
        res.status(401).json({message:"Loi validate :" + validate.error});
        return;
    }else{
        next();
    }
}

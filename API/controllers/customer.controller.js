const indexModel = require("../models/index.model");

module.exports.getCustomerList = async (req,res)=>{
    try {
        return res.status(200).json(await indexModel.customer.find().populate("bookcomment"));
    } catch (error) {
        return res.status(400).json({message:"Error from Server during get Customer List : "+ error});
    }
}

module.exports.getCustomer = async (req,res)=>{
    try {
        let custom = await indexModel.customer.findById(req.params.customer_id).populate("bookcomment");
        if(!custom) return res.status(403).json({message:"Customer not found!!!"});
        return res.status(200).json(custom);
    } catch (error) {
        return res.status(400).json({message:"Error from Server during get Customer : "+ error});
    }
}

module.exports.createCustomer = async (req,res)=>{
    try {
        let newCustomer = new indexModel.customer({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            street: req.body.street,
            city: req.body.city
        });
        await newCustomer.save();

        return res.status(200).json(newCustomer);
    } catch (error) {
        return res.status(400).json({message:"Error from Server during create Customer : "+ error});
    }
}

module.exports.updateCustomer = async (req,res)=>{
    try {
        let currentCustomer = await indexModel.customer.findById(req.params.customer_id);
        if(!currentCustomer) return res.status(403).json({message:"Customer not found!!!"});
        await currentCustomer.updateOne({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            street: req.body.street,
            city: req.body.city
        });

        return res.status(200).json({message:"Update Customer finish!!!"});
    } catch (error) {
        return res.status(400).json({message:"Error from Server during update Customer : "+ error});
    }
}

// Khong co khai niem xoa Customer ma chi co the inactive khach hang di thoi.
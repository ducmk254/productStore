const indexModel = require('../models/index.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const emailValidator = require('email-validator');
module.exports.getUserList = async (req, res) => {
  try {
    return res
      .status(200)
      .json(
        await indexModel.user
          .find()
          .select('username')
          .select('email')
          .select('isAdmin')
          .select('descreption')
          .select('access_token')
      );
  } catch (error) {
    return res.status(400).json({
      message: 'Error from Server during get user list' + error,
    });
  }
};
module.exports.getUser = async (req, res) => {
  try {
    let user = await indexModel.user.findById(req.params.user_id);
    if (!user) return res.status(403).json({message: 'User not found!!!'});
    return res.status(200).json(user);
  } catch (error) {
    return res.status(400).json({
      message: 'Error from Server during get user' + error,
    });
  }
};

//REGISTER:
module.exports.createUser = async (req, res) => {
  try {
    let newUser = new indexModel.user({
      username: req.body.username,
      email: req.body.email,
      password: await bcrypt.hashSync(req.body.password, 10),
      isAdmin: req.body.isAdmin,
      descreption: req.body.descreption,
    });
    await newUser.save();
    return res.status(200).json({message: newUser.username + ' - created.'});
  } catch (error) {
    return res.status(400).json({
      message: 'Error from Server during create user' + error,
    });
  }
};

module.exports.changeUser = async (req, res) => {
  try {
    let currentUser = await indexModel.user.findById(req.params.user_id);
    if (!currentUser) return res.status(403).json({message: 'User not found'});
    await currentUser.updateOne({
      // information of user:
      password: req.body.password,
      isAdmin: req.body.isAdmin,
      descreption: req.body.descreption,
    });
    return res.status(200).json({message: 'Update user finished'});
  } catch (error) {
    return res.status(400).json({
      message: 'Error from Server during change user' + error,
    });
  }
};

//LOGIN:
module.exports.login = async (req, res) => {
  let token = req.headers['auth-token'];
  if (token)
    return res.status(200).json({
      message:
        'Login with user_id: ' + jwt.verify(token, process.env.secret).user_id,
    });
  try {
    //check req.body.username is username or email ?
    let isEmail = false;
    if (emailValidator.validate(req.body.username)) isEmail = true;
    if (isEmail == true) {
      let user = await indexModel.user.findOne({email: req.body.username});
      if (!user) return res.status(403).json({message: 'Email not exist'});
      if (!(await bcrypt.compareSync(req.body.password, user.password))) {
        return res.status(403).json({message: 'Password failed ...'});
      } else {
        const token = jwt.sign({user_id: user._id}, process.env.secret);
        await user.updateOne({
          $push: {access_token: token},
        });
        return res
          .status(200)
          .header('auth-token', token)
          .send('auth-token: ' + token);
      }
    } else {
      let user = await indexModel.user.findOne({username: req.body.username});
      if (!user) return res.status(403).json({message: 'Username not exist'});
      if (!(await bcrypt.compareSync(req.body.password, user.password))) {
        return res.status(403).json({message: 'Password failed ...'});
      } else {
        const token = jwt.sign({user_id: user._id}, process.env.secret);
        await user.updateOne({
          $push: {access_token: token},
        });
        return res
          .status(200)
          .header('auth-token', token)
          .send('auth-token: ' + token);
      }
    }
  } catch (error) {
    return res.status(400).json({message: 'Error : ' + error});
  }
};

// LOGOUT:
module.exports.logout = async (req, res) => {
  let token = req.headers['auth-token'];
  if (!token) return res.status(200).json({message: 'you are not login...'});
  try {
    const loginId = jwt.verify(token, process.env.secret).user_id;
    let loginUser = await indexModel.user.findById(loginId);
    if (!loginUser) return res.status(403).json({message: "User don't exist"});
    await loginUser.updateOne({$pull: {access_token: token}});
    return res.status(200).json({message: 'Logout finish!'});
  } catch (error) {
    return res
      .status(400)
      .json({message: 'Error from server during logout ..' + error});
  }
};

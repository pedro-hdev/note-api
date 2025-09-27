var express = require('express');
var router = express.Router();
const User = require("../models/user")
const jwt = require("jsonwebtoken")
require("dotenv").config()

const secret = process.env.JWT_TOKEN

router.post('/register', async function (req, res) {
  const { name, email, password } = req.body
  const user = new User({ name, email, password })

  try {
    await user.save()
    res.status(200).json(user)
  } catch (e) {
    res.status(500).json({ message: "Error registering user", e })
  }
});

router.post('/login', async function (req, res) {
  const {email, password} = req.body
  try{
    let user = await User.findOne({email})
    if(!user){
      res.status(401).json({error: 'Incorrect email'})
    }else{
      user.isCorrectPassword(password, function(err, same){
        if(!same){
           res.status(401).json({message: "Incorrect email or password", err})
        }else{
          const token = jwt.sign({email}, secret, { expiresIn: '1d'})
           res.status(200).json({user: user , token: token})
        }
      })
    }

  }catch(e){
     res.status(500).json({erro: " Internal error, please try again "})
  }
  
})

module.exports = router;

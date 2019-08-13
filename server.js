const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const Joi = require("@hapi/joi");
const cors = require("cors");
const bcrypt = require('bcryptjs')


// const bcrypt = require('bcryptjs');
const PORT = 3500;

const app = express();

// body-parser middleware

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

// setting up the cors config / cors middleware
app.use(cors());

const User = require('./model/user')

mongoose.connect(
  "mongodb://127.0.0.1/formdata",
  { useNewUrlParser: true },
  error => {
    if (error) {
      console.log("database is not connected");
    } else {
      console.log("connection is live");
    }
  }
);

const schema = require("./inputValidation/Signup");

app.post("/signup", (req, res) =>
{
  const data = req.body;
  console.log(data);
  Joi.validate(data, schema, async (error, result) => {
    if (error) {
      console.log(error);
      
      return res.status(400).json(error);
    }

    const { fullname, email, password } = req.body

    try {
      let user =  await User.findOne({email: data.email})
      console.log(user)
      if (user) {
        return res.status(400).json({error:[{ msg: "user already exist"}]})
        
      }
      user = new User({ 
        fullname,
        email,
        password
      })
      
      const salt = await bcrypt.genSalt(10)
      user.password = await bcrypt.hash(password, salt)
      
      await user.save( (err, doc) => {
        if (err) {
          console.log("error in saving")
        } else {
          console.log(result);

         return res.status(200).json({
            userdetails: doc,
            msg: "you have succesfully registered"
          });

        } });
      // res.send('user Registered')
     
      
      
    } catch (error) {
      console.error(error.message)
      res.status(500).json('server error')
    }
    
  });
});

const Schema = require('./inputValidation/login');

app.post('/login', (req, res) => {

  const data = req.body;
  console.log(data)
Joi.validate(data, Schema, async (error, result) => {

    if(error){
      console.log(error)
      res.status(400).json({error: error})
    }

    const { email, password } = req.body

    try {
      let user = await User.findOne({ email })

      if (!user) {
        console.log(error)
        res.status(400).json({ error: [{msg: "user does not exist"}]})
      }

      const isMatch = await bcrypt.compare(password, user.password)

      if (!isMatch) {

        res.status(400).json({error:[{msg: "invalid credentials"}]})
      }
      else {
        console.log(result)
        res.status(200).json("you have successfully logged in")
      }



      
    } catch (error) {
      console.error(error)
      res.status(500).json({error: error.message})
      
    }
    
  })

  
})

app.listen(PORT, error => {
  if (error) {
    console.log("error in this connection");
  } else {
    console.log(`port ${PORT} is available`);
  }
});

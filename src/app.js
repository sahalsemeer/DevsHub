const express = require('express')
const connectDB = require('./config/database')
const mongoose = require('mongoose')
const userModel = require('./models/users')


const app = express()


app.post('/signup',async (req,res) => {
  const user = {
    firstName:"Sahal",
    lastName:"Semeer",
    password:"12sazde"
  }

  try {
     const users = new userModel(user)
     res.send('User Added Succesfully!')
     await users.save()
    
  } catch (error) {
    console.log(error);
    
  }
})

connectDB().then(() => {
    console.log('database connected');
    app.listen(7777,() => {
        console.log('server is running on 7777');
    })
}).catch(err => console.log('not connected',err))




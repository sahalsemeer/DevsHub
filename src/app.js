const express = require('express')


const app = express()

app.use('/test',(req,res) => {
    res.send('hello world!')
})

app.use('/hello',(req,res) => {
    res.send('hello page')
})
app.listen(7777,() => {
    console.log('server is running on 7777');
})
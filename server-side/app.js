// import packages
const express = require('express');
const bodyParser = require('body-parser');

// init app
const app = express();

// Middleware
app.use(bodyParser.json());

// Routes
app.get('/',(req,res,next)=>{
    res.send('working')
})
app.listen(2000);
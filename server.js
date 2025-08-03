const express = require('express');
const app = express();
const db = require('./db');
require('dotenv').config();


const bodyParser = require('body-parser');
app.use(bodyParser.json()); // req.body


app.get('/' , (req , res)  => {
    res.send("my name is jatin kushwaha");
});


// import the router files
const userRoutes = require('./routes/userRoutes');


// use the routers
app.use('/user' , userRoutes);

app.listen(3000 , () => {
    console.log("listening on port 3000");
});


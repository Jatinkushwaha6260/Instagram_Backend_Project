const express = require('express');
const router = express.Router();
const User = require('./../models/userModel');
const {jwtAuthMiddleware , generateToken} = require('./../jwt');

router.get('/' , (req , res) => {
    res.send("what is your name and");


});

// Signup route by post method
router.post('/signup' , async (req , res) => {
    try{
         
     const data = req.body; // Assuming the request body contains the user data

       // Check user already Exists or not 
        
            const userExists = await User.findone({email: data.email});

            if (userExists) {
                return res.status(400).json({ message: 'user already exists' });
            }
        


        // Create a new user document using the mongoose model
        const newUser = new User(data);

        // save the new user to the database
        const response = await newUser.save();
        console.log('data saved');

        const payload = {
            id: response.id
        }

        console.log(JSON.stringify(payload));
        const token = generateToken(payload);
        console.log("Token is:" , token);

        res.status(200).json({response: response , token: token});

    }catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal server error'});

    }
      
});


// Login route by post method
router.post('/login' , async (req , res) => {
    try{
        // Extract aadharCardNumber and password fron request body
        const {email , password}  = req.body;

        // Find the user by email
        const user = await User.findOne({email});

        // If user does not exist or password does not match , return error
        if(!user || !(await user.comparePassword(password))){
            return res.status(401).json({error: 'Invalid user or  password'});
        }

        // generate token
        const payload = {
            id: user.id
        }
        const token = generateToken(payload);

        // return token as response
        res.json({token});


    }catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal server error'});

    }
});


// Profile route by get method
router.get('/myProfile' , jwtAuthMiddleware ,async (req , res) => {
    try{
    const userData = req.user;
    const userId = userData.id;
    const user = await User.findById(userId);
    res.status(200).json({user});
}catch(err){
    console.log(err);
    res.status(500).json({error: 'Internal server error'});

}
});

// get another user by Id or username
router.get('/userProfile/:username' , jwtAuthMiddleware , async (req , res) => {
    try{
    const {username} = req.params;
    const user = await User.findOne({username})  // is line ko abhi pura karna hai

    if(!user) {
        return res.status(404).json({message: "user not found"});
    }

    res.status(200).json(user);
}catch(err){
     console.log(err);
    res.status(500).json({error: 'Internal server error'});
    
}

});


// update profile by put method
router.put('/updateProfile' , jwtAuthMiddleware , async (req ,res) => {
    try{
        const {bio} = req.body;
        const avatar = req.body.avatar || req.file?.path; // ye line samajh me nahi aayi

        const user = await User.findById(req.user.id);

        if(!user){
            return res.status(404).json({message: "user not found"});
        }

        user.bio = bio || user.bio;
        if(avatar) {
            user.avatar = avatar;
        }

        await user.save();

        res.status(200).json(user);

    }catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal server error'});
    }

});


module.exports = router;
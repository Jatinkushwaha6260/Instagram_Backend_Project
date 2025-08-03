const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


// define the user schema
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true

    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    bio: {
        type: String,
        default: ""
    },
    avatar: {
        type: String,
        default: ""
    },
    followers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    following: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    isAdmin: {
        type: Boolean,
        default: false
    }

}, { timestamps: true});


userSchema.pre('save' , async function(next){
    const user = this;

    // Hash the password only if it has been modified (or is new)
    if(!user.isModified('password')) return next();
    

    try{
        // Hash password generation
        const salt = await bcrypt.genSalt(10);

        // Hash password
        const hashedPassword = await bcrypt.hash(user.password , salt);

        // Override the plain password with the hashed one
        user.password = hashedPassword;
        next();
    }catch(err){
        return next(err);
    }

});

userSchema.methods.comparePassword = async function(candidatePassword){
    try{
        // use bcrypt to compare to provided password  with the hashed password
        const isMatch = await bcrypt.compare(candidatePassword , this.password);
        return isMatch;

    }catch(err){
        throw err;
    }
}


const User = mongoose.model('User' , userSchema);
module.exports = User;
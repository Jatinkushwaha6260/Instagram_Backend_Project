const mongoose = require('mongoose');

// define the post schema
const postSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    caption: {
        type: String

    },
    image: {
        type: String,
        required: true
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }

    ],
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
    
}, {timestamps: true});










const Post = mongoose.model('Post' , postSchema);
module.exports = Post;
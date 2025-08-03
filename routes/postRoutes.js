const express = require('express');
const router = express.Router();
const User = require('./../models/userModel');
const Post = require('./../models/postModel');
const {jwtAuthMiddleware , generateToken} = require('./../jwt');



const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');

const User = require('../model/userModel');


// @desc => Register new user
// @desc => POST /api/users
// @access => Public
const registerUser = asyncHandler(async (req, res) => {

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        res.status(400)
        throw new Error('Please enter input in all the fields')
    }


    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400)
        throw new Error('User already exist')
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
        "name": name,
        "email": email,
        "password": hashedPassword,
    });

    if (user) {
        res.status(201).json({
            "message": `user created successully`,
            "userDetails": {
                _id: user._id,
                name: user.name,
                email: user.email,
                "token": generateToken(user._id)
            }
        })
    } else {
        res.status(400)
        throw new Error('Invalid user data');
    }

});


// @desc => Login new user
// @desc => POST /api/users/login
// @access => Public
const loginUser = asyncHandler(async (req, res) => {

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
        console.log(user);
        res.json({
            "message": "user logged in successfully",
            "userDetails": {
                _id: user._id,
                name: user.name,
                email: user.email,
                "token": generateToken(user._id)
            }
        })
    } else {
        res.status(400)
        throw new Error('Invalid credentials')
    }
});


// @desc => Get user data
// @desc => GET /api/users/login
// @access => Private
const getMe = asyncHandler(async (req, res) => {

    const { _id, name, email } = await User.findById(req.user.id);

    res.status(200).json({
        "userDetials": {
            id: _id,
            name: name,
            email: email
        }
    })

});


// generate jwt token
const generateToken = (id) => {

    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    })

}

module.exports = {
    registerUser,
    loginUser,
    getMe
}

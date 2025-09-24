require('dotenv').config();
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/User");



router.post("/login", async(req, res) => {

    const JWT_SECRET = process.env.JWT_SECRET;

    const { user, password } = req.body;

    // check if user exists
    const foundUser = await User.findOne({user});
    if (!foundUser) return res.status(400).json({error: "user not found"});

    // check if password correct
    const valid = await bcrypt.compare(password, foundUser.password);    
    if (!valid) return res.status(400).json({error: "password incorrect"});

    // increment login_count by 1
    var counter = foundUser.login_count + 1;

    const payloadCounterUpdate = {login_count: counter};

    const updateCounter = await User.findByIdAndUpdate(foundUser._id, payloadCounterUpdate);
    
    if (!updateCounter) {
        res.status(400).json({message: `User Counter not updated`});
    }

    const token = jwt.sign(
        {
            id: foundUser._id,
            username: foundUser.username,
            user: foundUser.user
        },
        JWT_SECRET,
        //{ expiresIn: '5000'}
        { expiresIn: '1h'}
    )

    res.json({token: token});

});

module.exports = router;
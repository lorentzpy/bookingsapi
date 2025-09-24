const User = require("../models/User");
const bcrypt = require("bcrypt");

exports.getUsers = async (req, res) => {
    try {
        const users = await User.find({});

        res.status(200).json(users);
        
    } catch (err) {
        console.error(err);
    }
}

exports.getPrefs = async (req, res) => {
    try {
        const { id:userId } = req.params;

        if (req.user.id != userId) {
            return res.status(403).json({error: "Forbidden"});
        }

        const reqPayload = {}
        reqPayload["_id"] = userId;

        const user = await User.findOne(reqPayload);

        res.status(200).json(user.prefs);

    } catch (err) {
        console.error(err); 
        res.status(500).json({error: "fetching user prefs failed"});
    }
}

exports.updatePrefs = async (req, res) => {
    try {
        const { id:userId } = req.params;
        const prefsBody = req.body;
        
        const updateUserPrefs = await User.findByIdAndUpdate(userId, prefsBody);

        if (!updateUserPrefs) {
            res.status(400).json({message: "User prefs update failed"});
        }

        res.status(200).json({message:"User prefs updated successfully"});

    } catch (err) {
        console.error(err);
        res.status(500).json({error: "error updating user prefs"});
    }
}

exports.setPassword = async (req, res) => {
    try {
        const saltRounds = 12;
        const {id: userId} = req.params;
        const passwordBody = req.body;

        // check if current password is correct
        if (req.method === "PATCH") {
            const currentPassword = passwordBody.currentPassword;

            // query current password
            const currentUser = await User.findById(userId).select("password");

            if (currentUser) {
                const userPassword = currentUser.password;

                const comparePasswords = await bcrypt.compare(currentPassword, userPassword);

                if (!comparePasswords) {
                    res.status(401).json({message:"Passwords don't match!"});
                    return false;
                }
            }
        }

        const hashedPassword = await bcrypt.hash(passwordBody.password, saltRounds);

        const passwordPayload = {"$set": {"password":hashedPassword}};

        const updatePassword = await User.findByIdAndUpdate(userId, passwordPayload);

        if (!updatePassword) {
            res.status(400).json({message: "Password update failed"});
            console.log("Password update failed");
            return;
        }

        res.status(200).json({message: "Password updated correctly!"});


    } catch(err) {
        console.error("error updating password", err);
        res.status(500).json({error: "error updating password"});
    }
}
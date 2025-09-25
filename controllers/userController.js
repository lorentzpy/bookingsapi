const User = require("../models/User");
const {hashAndSetPassword, compareHashes} = require("../utils/password");

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

exports.deleteUser = async (req, res) => {
    try {
        const {id: userId} = req.params;
        await User.deleteOne( {_id: userId} )

        res.status(200).json({"message":"User has been deleted"});
    }
    catch(err) {
        console.error("error deleting user", err);
        res.status(500).json({error: "error deleting user"});
    }
}

exports.createUser = async (req, res) => {
    try {
        const { password, ...userData } = req.body;

        // append login_count
        userData.login_count = 0;
        const newUser = await User.create(userData);

        const userId = newUser._id;

        if (password) {
            await hashAndSetPassword(userId, password);
        }

        res.status(200).json({message:"New user created"});
    }
    catch (err) {
        console.error("error creating user");
        res.status(500).json({error: "error creating user"});
    }
}

exports.setPassword = async (req, res) => {
    try {      
        const {id: userId} = req.params;
        const passwordBody = req.body;

        // check if current password is correct. Suitable only for patch (password update)
        if (req.method === "PATCH") {
            const currentPassword = passwordBody.currentPassword;

            // query current password
            const currentUser = await User.findById(userId).select("password");

            if (currentUser) {
                const userPassword = currentUser.password;

                const comparePasswords = await compareHashes(currentPassword, userPassword);

                if (!comparePasswords) {
                    res.status(401).json({message:"Passwords don't match!"});
                    return false;
                }
            }
        }

        const newPassword = passwordBody.password;

        await hashAndSetPassword(userId, newPassword)

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
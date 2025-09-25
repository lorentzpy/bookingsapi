const bcrypt = require("bcrypt");

const User = require("../models/User");

async function hashAndSetPassword(userId, newPassword) {
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    const passwordPayload = {"$set": {"password":hashedPassword}};

    await User.findByIdAndUpdate(userId, passwordPayload);

    return true
}

module.exports = {hashAndSetPassword};

async function compareHashes(hash1, hash2) {
    const comparePasswords = await bcrypt.compare(hash1, hash2);
}
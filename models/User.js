const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        user: {type: String, required: true},
        username: {type: String, required: true},
        password: {type: String, required: true},
        last_login: {type: Date, required: false},
        login_count: {type: Number, required: false},
        prefs: {
            zones: {
                type: [String],
                required: false,
                default: []
            },
            public_holidays: {type: Boolean, required: false}
        }
    },
    {collection: "users"}
);

const User = mongoose.model("User", userSchema);

module.exports = User;
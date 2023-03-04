const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
    pseudo : {type: String, require: true},
    dateOfBirth: {type: Date, require: true},
})

const User = new mongoose.model("User", UserSchema)

module.exports = User
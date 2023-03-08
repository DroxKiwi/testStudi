const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
    pseudo : {type: String, require: true},
    dateOfBirth: {type: Date, require: true},
    token: {type : String, require:true},
    salt: {type : String, require: true},
    hash: {type : String, require: true},
    role: {type : String, default: "USER"}
})

const User = new mongoose.model("User", UserSchema)

module.exports = User
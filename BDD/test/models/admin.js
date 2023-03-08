const mongoose = require("mongoose")

const AdminSchema = new mongoose.Schema({
    // ref to user
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User"},
})

const Admin = new mongoose.model("Admin", AdminSchema)

module.exports = Admin
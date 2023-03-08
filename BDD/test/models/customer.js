const mongoose = require("mongoose")

const CustomerSchema = new mongoose.Schema({
    // ref to user
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User"},
    subscription: { type : Boolean, default: false }
})

const Customer = new mongoose.model("Customer", CustomerSchema)

module.exports = Customer
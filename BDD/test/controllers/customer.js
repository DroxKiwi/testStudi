const encryptPassword = require("../utils/encryptPassword")
const { models } = require("mongoose")


// need an _id 
async function customerAdd(req, res){
    try{
        if (!req.body._id){
            return res.josn("missing _id")
        }
        //if (req.role !== "ADMIN"){
        //    return res.json("Unauthorized")
        //}
        else {
            const user = req.app.get("models").User
            userAct = await user.findById(req.body._id)
            if (!userAct){
                return res.json("Not a current user")
            }
            else {
                userAct.role = "USER"
                await new models.Customer({ user: userAct._id }).save()
                return res.json("succefuly updateto to ADMIN")
            }
        }
    }
    catch(error){
        return res.json(error.message)
    }
}

async function customers(req, res){
    const customer = req.app.get("models").Customer
    const customersList = await customer.find().populate("user")
    res.json(customersList)
}

async function customerUpdate(req, res){
    if (req.role !== "ADMIN"){
        return res.json("Unauthorized")
    }
    try {
        if (!req.body._id){
            return res.json("No _id provided")
        }
        const customer = req.app.get("models").Customer

        let customerMod = await customer.findById(req.body._id)
        if (!customerMod){
            return res.json("Customer not found")
        }
        const keysMod = Object.keys(req.body.mod)
        for (const key of keysMod){
            customerMod[key] = req.body.mod[key]
        }
        await customerMod.save()
        res.json(customerMod)
    }
    catch(error){
        return res.json(error.message)
    }
}

async function customerDelete(req, res){
    if (req.role !== "ADMIN"){
        return res.json("Unauthorized")
    }
    if (!req.body._id){
        return res.json("No _id provided")
    }
    const customer = req.app.get("models").Customer
    const user = req.app.get("models").User
    let answer = await user.findByIdAndDelete(req.body._id)
    if (!answer){
        return res.json("Customer not found")
    }
    answer = await customer.findByIdAndDelete(req.body._id)
    if (!answer){
        res.json("this _id for customer dosn't exist")
    }
    else {
        res.json("Successfully deleted")
    }
}

module.exports = { customers, customerAdd, customerDelete, customerUpdate }     
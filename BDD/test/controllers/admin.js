const encryptPassword = require("../utils/encryptPassword")
const { models } = require("mongoose")

async function adminAdd(req, res){
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
                userAct.role = "ADMIN"
                await new models.Admin({ user: userAct._id }).save()
                return res.json("succefuly updateto ADMI")
            }
        }
    }
    catch(error){
        return res.json(error.message)
    }
}

async function admins(req, res){
    const admin = req.app.get("models").Admin
    const adminsList = await admin.find().populate("user")
    res.json(adminsList)
}

async function adminUpdate(req, res){
    if (req.role !== "ADMIN"){
        return res.json("Unauthorized")
    }
    try {
        if (!req.body._id){
            return res.json("No _id provided")
        }
        const admin = req.app.get("models").Admin

        let adminMod = await admin.findById(req.body._id)
        if (!adminMod){
            return res.json("Customer not found")
        }
        const keysMod = Object.keys(req.body.mod)
        for (const key of keysMod){
            adminMod[key] = req.body.mod[key]
        }
        await adminMod.save()
        res.json(adminMod)
    }
    catch(error){
        return res.json(error.message)
    }
}

async function adminDelete(req, res){
    if (req.role !== "ADMIN"){
        return res.json("Unauthorized")
    }
    if (!req.body._id){
        return res.json("No _id provided")
    }
    const admin = req.app.get("models").Admin
    const user = req.app.get("models").User
    let answer = await user.findByIdAndDelete(req.body._id)
    if (!answer){
        return res.json("Customer not found")
    }
    answer = await admin.findByIdAndDelete(req.body._id)
    if (!answer){
        res.json("this _id for admin dosn't exist")
    }
    else {
        res.json("Successfully deleted")
    }
}

module.exports = { admins, adminAdd, adminDelete, adminUpdate }     
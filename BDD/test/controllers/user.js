const encryptPassword = require("../utils/encryptPassword")
const decryptPassword = require("../utils/decryptPassword")

async function userGet(req, res){
    try{
        const user = req.app.get("models").User
        const users = await user.find()
        res.json(users)
    }
    catch (error){
        return error.message
    }
}

async function userCreate(req, res){
    try{
        if (!req.body.password){
            res.json("No password, pls give one")
        }
        if (req.role !== "ADMIN"){
            return res.json("Unauthorized")
        }
        else {
            console.log(req.role)
            const {token, salt, hash} = encryptPassword(req.body.password)

            const user = req.app.get("models").User
            console.log(req.body)
            const newUser = await new user ({ 
                pseudo: req.body.pseudo, 
                dateOfBirth: req.body.dateOfBirth,
                token,
                salt,
                hash
            }).save()
            res.json(newUser)
        }
    }
    catch (error){
        res.json(error.message)
    }
}

async function userUpdate(req, res){
    try{
        if (!req.body._id){
            res.json("_id missing")
        }
        if (req.role !== "ADMIN"){
            return res.json("Unauthorized")
        }
        const user = req.app.get("models").User
        const userToMod = await user.findById(req.body._id)
        console.log(userToMod)
        if (!userToMod){
            res.json("this _id dosn't exist")
        }
        else {
            const KeysToMod = Object.keys(req.body.toModify)
            for (const key of KeysToMod){
                userToMod[key] = req.body.toModify[key]
            }
            console.log(userToMod)
            userToMod.save()
            res.json("Successfully updated")
        }
    }
    catch (error){
        res.json(error.message)
    }
}

async function userDelete(req, res){
    try{
        if (!req.body._id){
            res.json("_id missing")
        }
        if (req.role !== "ADMIN"){
            return res.json("Unauthorized")
        }
        const user = req.app.get("models").User
        let answer = await user.findByIdAndDelete(req.body._id)
        if (!answer){
            res.json("this _id dosn't exist")
        }
        else {
            res.json("Successfully deleted")
        }
        console.log(answer)
    }
    catch (error){
        res.json(error.message)
    }
}

async function userLogin(req, res){
    try {
        if (!req.body._id || !req.body.password){
            res.json("_id or password missing")
        }
        else {
            const user = req.app.get("models").User
            const userToConnect = await user.findById(req.body._id)
            if (!userToConnect){
                res.json("no user found")
            }
            else {
                res.json(decryptPassword(userToConnect, req.body.password))
            }
        }
    }
    catch(error){
        res.json(error.message)
    }
}

module.exports = { userGet, userCreate, userDelete, userUpdate, userLogin }     
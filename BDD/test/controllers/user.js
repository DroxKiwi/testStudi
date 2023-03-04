async function userGet(req, res){
    try{
        const User = req.app.get("models").User
        const MyUsers = await User.find()
        res.json(MyUsers)
    }
    catch (error){
        return error.message
    }
}

async function userCreate(req, res){
    try{
        const User = req.app.get("models").User
        const newUser = await new User ({ 
            pseudo: "JonnyBigood", 
            dateOfBirth: new Date() 
        }).save()
        res.json(newUser)
    }
    catch (error){
        res.json(error.message)
    }
}

module.exports = { userGet, userCreate }     
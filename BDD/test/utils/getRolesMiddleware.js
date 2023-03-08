async function getRolesMiddleware(req, res, next){
    if (!req.body?.token){
        req.role = "unauthentificated"
        return next()
    }
    const user = req.app.get("models").User
    const userCheck = await user.findOne({ token: req.body.token })
    if (!userCheck){
        req.role = "unauthentificated"
        return next()    
    }

    req.role = userCheck.role
    return next()
}

module.exports = getRolesMiddleware
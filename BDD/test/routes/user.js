const {userGet, userCreate } = require("../controllers/user")

function userRoute(app){
    // Create
    app.post("/userCreate", userCreate)
    // Read
    app.get("/user", userGet)
}

module.exports = userRoute
const { admins, adminAdd, adminDelete, adminUpdate } = require("../controllers/admin")

function adminRoute(app){

    // Populate
    app.get("/admins", admins)

    // Create
    app.post("/adminAdd", adminAdd)

    // Update
    app.post("/adminUpdate", adminUpdate)

    // Delete
    app.post("/adminDelete", adminDelete)
}

module.exports = adminRoute
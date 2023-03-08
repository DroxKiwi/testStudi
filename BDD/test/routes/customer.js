const { customers, customerAdd, customerDelete, customerUpdate } = require("../controllers/customer")

function customerRoute(app){

    // Create
    app.post("/customerAdd", customerAdd)

    // Populate
    app.get("/customers", customers)

    // Update
    app.post("/customerUpdate", customerUpdate)

    // Delete
    app.post("/customerDelete", customerDelete)
}

module.exports = customerRoute
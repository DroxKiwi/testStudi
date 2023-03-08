/* From express website
const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
*/

const express = require("express")
const app = express()
const port = 3000

const userRoute = require("./routes/user")
const customerRoute = require("./routes/customer")
const adminRoute = require("./routes/admin")
const getRolesMiddleware = require("./utils/getRolesMiddleware")

const mongoose = require("mongoose")
//mongoose.connect("mongodb://localhost/testDB")
main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/testDB');
  
  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

const models = require("./models")

app.set("models", models)

app.use(express.json())
app.use(getRolesMiddleware)

userRoute(app)
customerRoute(app)
adminRoute(app)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

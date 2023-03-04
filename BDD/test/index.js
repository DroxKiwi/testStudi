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
const userRoute = require("./routes/user")
const app = express()
const port = 3000

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

userRoute(app)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

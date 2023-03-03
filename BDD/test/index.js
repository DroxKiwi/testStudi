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

app.use(express.json())

userRoute(app)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
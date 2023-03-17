const express = require('express')
const clientRouter = require('./route/tournament.route')
const userRouter = require('./route/user.route')
const authRouter = require('./route/auth.route')
const bodyParser = require('body-parser')
const cors = require('cors')

require('dotenv').config()
const env = process.env

const app = express()
app.use(cors({
  origin: [`${env.CLIENT_URL}`]
}))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


// mysql init
const db = require('./model')

db.sequelize.sync()
  .then(() => {
    console.log('Synced db.')
  })
  .catch((err) => {
    console.log('Failed to sync db: ' + err.message)
  })


app.use('/client', clientRouter)
app.use('/user', userRouter)
app.use('/auth', authRouter)

app.listen(env.PORT, () => {
  console.log('Server is running on port 3000')
})

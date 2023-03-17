const db = require('../model')
const User = db.user
const Op = db.Sequelize.Op

const createUser = async (req, res) => {
  const { name, email, password } = req.body

  const user = await User.create({
    name,
    email,
    password,
  })

  // check for errors
  if (user) {
    res.status(200).send({
      message: 'User created',
      user,
    })
  }

  res.status(500).send({
    message: 'Error creating user',
  })

}

module.exports = { createUser }
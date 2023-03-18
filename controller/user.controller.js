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

  console.log('user: ', user)

  // check for errors
  if (user) {
    return res.status(200).send({
      message: 'User created',
      user,
    })
  }

  return res.status(500).send({
    message: 'Error creating user',
  })

}

module.exports = { createUser }
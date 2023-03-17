const db = require('../model')
const User = db.user
const Op = db.Sequelize.Op
const jwt = require('jsonwebtoken')
const Joi = require('joi')

const JWT_SECRET = 'rahasia'

const authController = async (req, res) => {

  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  })

  const { error } = schema.validate(req.body)

  if (error) {
    return res.status(400).json({
      message: error.details[0].message,
    })
  }

  const { email, password } = req.body

  const user = await User.findOne({
    where: {
      email,
      password,
    },
  })

  if (user) {
    const token = jwt.sign({
      email,
      id: user.id,
    }, JWT_SECRET)

    res.status(200).send({
      message: 'User authenticated',
      token,
    })
  } else {
    res.status(401).send({
      message: 'Invalid email or password',
    })
  }
}

module.exports = { authController }
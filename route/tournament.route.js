const express = require('express')
const tournamentController = require('../controller/tournament.controller')
const { withJWTAuthMiddleware } = require('express-kun')
const { getPayload } = require('../helper/jwt.helper')

require('dotenv').config()
const env = process.env

const router = express.Router()
const protectedRouter = withJWTAuthMiddleware(router, env.JWT_SECRET)


router.get('/', tournamentController.clientHello)
protectedRouter.post('/createTournament', tournamentController.storeTournament)
router.post('/updateMatch', tournamentController.updateMatch)
router.get('/getTournament', tournamentController.getTournament)
protectedRouter.post('/swapParticipants', tournamentController.swapParticipants)
protectedRouter.get('/getTournament/user', tournamentController.getTournamentByUserId)


protectedRouter.get('/protected', (req, res) => {

  const payload = getPayload(req)

  res.json({
    message: 'Protected route',
    payload
  })

})

module.exports = router


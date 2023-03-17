const { JsonDatabase } = require('brackets-json-db')
const { BracketsManager, helpers } = require('brackets-manager')
const db = require('../model')
const Tournament = db.tournament
const { getPayload } = require('../helper/jwt.helper')
const Joi = require('joi')


const storage = new JsonDatabase()
const manager = new BracketsManager(storage)

const createTournament = async (req, res) => {
  const { name, tournamentId, type, seeding, settings } = req.body

  // round seeding.length to the nearest power of 2
  const nearestPowerOf2 = Math.pow(2, Math.round(Math.log(seeding.length) / Math.log(2)))

  // add null values to seeding array to make it a power of 2
  for (let i = seeding.length; i < nearestPowerOf2; i++) {
    seeding.push(null)
  }

  await manager.create({
    tournamentId,
    name,
    type,
    seeding,
    settings,
  })

  res.json({
    message: 'Tournament created',
  })
}

const updateMatch = async (req, res) => {
  const { matchID, opponent1, opponent2 } = req.body

  await manager.update.match({
    id: matchID,
    opponent1,
    opponent2,
  })


  res.json({
    message: 'Match updated',
  })
}

const getTournament = async (req, res) => {
  const tournamentId = req.query.id
  const id = Number(tournamentId)
  const tournament = await manager.get.tournamentData(id)

  let message = 'Tournament fetched'

  if (tournament.participant.length === 0) {
    message = 'Tournament not found'
  }


  res.json({
    message,
    tournament,
  })
}

const swapParticipants = async (req, res) => {

  const JoiSchema = Joi.object({
    tournamentId: Joi.number().required(),
    participant1: Joi.object({
      id: Joi.number().required(),
      name: Joi.string().required(),
      tournament_id: Joi.number().required(),
    }).required(),
    participant2: Joi.object({
      id: Joi.number().required(),
      name: Joi.string().required(),
      tournament_id: Joi.number().required(),
    }).required(),
  })

  const { error } = JoiSchema.validate(req.body)

  if (error) {
    console.log('error', error)
    return res.status(400).json({
      message: error.details[0].message,
    })
  }

  const { tournamentId, participant1, participant2 } = req.body

  // update participant in database
  await storage.update(
    'participant',
    {
      id: parseInt(participant2.id),
      tournament_id: parseInt(tournamentId),
    },
    {
      name: participant1.name,
    })
  await storage.update(
    'participant',
    {
      id: parseInt(participant1.id),
      tournament_id: parseInt(tournamentId),
    },
    {
      name: participant2.name,
    })

  res.json({
    message: 'Participants swapped',
  })
}

const clientHello = async (req, res) => {

  // let x = [
  //     'Team 1', 'Team 2',
  //     'Team 3', 'Team 4',
  //     'Team 5', 'Team 6',
  //     'Team 7', 'Team 8',
  //     'Team 9', 'Team 10',
  //     'Team 11', 'Team 12'
  // ];
  let x = [
    'Gaming Gladiator',
    'Team Spirit',
    'Team Liquid',
    'Entity',
    'EG',
    'Talon',
    'Shopify',
    'Team Aster',
    'PSG LGD',
    'Tundra',
    'Beastcoast',
    'HellRaisers',
  ]

  // let x = [
  //     {name: 'Team 1', id: 1},
  //     {name: 'Team 2', id: 2}
  // ]

  const nearestPowerOf2 = Math.pow(2, Math.round(Math.log(x.length) / Math.log(2)))


  // add null values to seeding array to make it a power of 2
  for (let i = x.length; i < nearestPowerOf2; i++) {
    x.push(null)
  }

  console.log(x)

  await manager.create({
    name: 'Example with double grand final',
    tournamentId: 1,
    type: 'double_elimination',
    seeding: x,
    settings: {
      seedOrdering: ['inner_outer', 'natural'],
      skipFirstRound: true,
      grandFinal: 'double',
      // seedOrdering: ['natural'],
    },
  })

  res.json({
    message: 'Hello from client',
  })
}

const storeTournament = async (req, res) => {
  console.log('storeTournament', req.body)

  const schema = Joi.object({
    name: Joi.string().required(),
    type: Joi.string().required(),
    seeding: Joi.array().required(),
    settings: Joi.object().required(),
  })

  const { error } = schema.validate(req.body)
  if (error) {
    return res.status(400).json({
      message: error.details[0].message,
    })
  }

  const { name, type, seeding, settings } = req.body

  const payload = getPayload(req)
  const userId = payload.id

  // save into database
  const tournament = await Tournament.create({
    name,
    participants: JSON.stringify(seeding),
    userId,
  })

  if (!tournament) {
    res.status(500).json({
      message: 'Tournament not created',
    })
  }

  // round seeding.length to up the nearest power of 2
  const nearestPowerOf2 = Math.pow(2, Math.ceil(Math.log2(seeding.length)))

  // add null values to seeding array to make it a power of 2
  for (let i = seeding.length; i < nearestPowerOf2; i++) {
    seeding.push(null)
  }


  await manager.create({
    tournamentId : tournament.id,
    name,
    type,
    seeding,
    settings,
  })

  res.json({
    message: 'Tournament created',
    tournament,
  })
}

const getTournamentByUserId = async (req, res) => {
  const payload = getPayload(req)
  const userId = payload.id

  const tournaments = await Tournament.findAll({
    where: {
      userId,
    },
    order: [
      ['createdAt', 'DESC'],
    ],
  })

  res.json({
    message: 'Tournaments fetched',
    tournaments,
  })
}

module.exports = {
  clientHello,
  createTournament,
  updateMatch,
  getTournament,
  swapParticipants,
  storeTournament,
  getTournamentByUserId,
}

// seedOrdering: ["inner_outer"] = just like liquipedia dota2 competition
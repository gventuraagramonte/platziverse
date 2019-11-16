'use strict'

const setupDatabase = require('./lib/db')
const setupAgentModel = require('./models/agent')
const setupMetricModel = require('./models/metric')
const defaults = require('defaults')

module.exports = async function (config) {
  config = defaults(config, {
    dialect: 'sqlite',
    pool: {
      max: 10,
      min: 0,
      idle: 10000
    },
    query: {
      raw: true
    }
  })

  const sequilize = setupDatabase(config)
  const AgentModel = setupAgentModel(config)
  const MetricModel = setupMetricModel(config)

  AgentModel.hasMany(MetricModel) // el modelo de agente tiene muchas metricas
  MetricModel.belongsTo(AgentModel) // el modelo de metrica pertenece a un agente

  await sequilize.authenticate()

  if (config.setup) {
    await sequilize.sync({ force: true })
  }
  // sequilize.sync()  Configuracion de la base de datos, sino existe en la base de datos lo crea

  const Agent = {}
  const Metric = {}

  return {
    Agent,
    Metric
  }
}

'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

const vip = '"http://localhost:3000"'
module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',

  BACKEND_ADDR: vip,
  LIST_DOC_ADDR: vip,
  SEND_ADDR: vip,
  DE_ADDR: vip,
  EX064_ADDR: vip,
  AUTH_DE_ADDR: vip,
  AUTH_AGENT_ADDR: vip
})

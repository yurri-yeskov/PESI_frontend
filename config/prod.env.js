'use strict'

const vip = '"http://192.168.37.71:3000"'
module.exports = {
  NODE_ENV: '"production"',
  SCANNER_IP: '"localhost"',
  SCANNER_CONTENT_TYPE: '"application/soap+xml"',
  BACKEND_ADDR: vip,
  SCAN_RESOURCE: '"/api/v1/scan"',
  LOG_RESOURCE: '"/api/v1/logs"',
  UPLOAD_RESOURCE: '"/api/v1/xerox/upload/"',
  CONSEILLER_RESOURCE: '"/api/v1/conseiller"',
  REGION_RESOURCE: '"/api/v1/region/"',
  LOG_LEVEL: '"debug"',
  LOG_CONSOLE: 'false',
  LOG_SERVER: 'true',

  LIST_DOC_ADDR: vip,
  SEND_ADDR: vip,
  DE_ADDR: vip,
  EX064_ADDR: vip,
  AUTH_DE_ADDR: vip,
  AUTH_AGENT_ADDR: vip,

  AUTH_DE_CLIENT_ID: '""',
  AUTH_DE_CLIENT_SECRET: '""',
  AUTH_AGENT_CLIENT_ID: '""',
  AUTH_AGENT_CLIENT_SECRET: '""',

  PE_ID_ENVIRONMENT: '""'
}

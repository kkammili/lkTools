const cron = require('node-cron')
const sendConnect = require('./sendconnect')
cron.schedule('0 0 * * *', ()=>{
    sendConnect()
})
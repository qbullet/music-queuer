const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const queueRoute = require('./src/routers/queue')
const lineRoute = require('./src/routers/line')

const app = express()
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors())

//ROUTER
app.use('/queue', queueRoute)
app.use('/line', lineRoute)

//Basic Route
app.get('/', (req, res) => {
  res.send('MUSIC QUEUER is running...')
})

const PORT = process.env.PORT || 3030
app.listen(PORT, () => {
  console.log(`MUSIC QUEUER is running on port ${PORT} ...`)
})

module.exports = app

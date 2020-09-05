const express =  require('express')
const lineController = require('../controllers/lineController')
const router = express.Router()

router.post('/callback', lineController.eventListener)
  
module.exports = router;  
const express =  require('express')
const queueController = require('../controllers/queueController')
const router = express.Router()

router.get('/', queueController.getMusics)
router.get('/:id', queueController.getMusicOne)
router.patch('/:id', queueController.changeState)
router.delete('/:id', queueController.removeMusic)
router.post('/', queueController.addMusic)

module.exports = router;  
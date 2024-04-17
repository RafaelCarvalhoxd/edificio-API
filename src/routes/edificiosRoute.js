const express = require('express');
const router = express.Router();
const edificiosController = require('../controllers/edificiosController');

router.get('/edificios', edificiosController.getAllEdificios);
router.get('/edificios/:id', edificiosController.getEdificio)
router.post('/edificios', edificiosController.createEdificio)
router.put('/edificios/:id', edificiosController.updateEdificio)
router.delete('/edificios/:id', edificiosController.deleteEdificio)

module.exports = router;
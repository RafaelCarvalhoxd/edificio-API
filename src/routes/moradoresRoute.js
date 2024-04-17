const express = require('express');
const router = express.Router();
const moradoresController = require('../controllers/moradoresController');

router.get('/moradores', moradoresController.getAllMoradores)
router.get('/moradores/:id', moradoresController.getMorador)
router.post('/moradores', moradoresController.createMorador)
router.put('/moradores/:id', moradoresController.updateMorador)
router.delete('/moradores/:id', moradoresController.deleteMorador)

module.exports = router;
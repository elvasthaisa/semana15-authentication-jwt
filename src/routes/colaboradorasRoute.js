const express = require("express");
const router = express.Router();
const controller = require('../controllers/colaboradorasController.js');

router.get('/', controller.getAll);
router.post('/', controller.postColaboradora);
router.post('/login', controller.login);
router.delete('/:id', controller.deleteColaboradora);

module.exports = router;

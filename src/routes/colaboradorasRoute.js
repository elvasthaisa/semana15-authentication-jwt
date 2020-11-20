const express = require("express");
const router = express.Router();
const controller = require('../controllers/colaboradorasController.js');

router.post('/', controller.postColaboradora);
router.get('/', controller.getAll);
router.post('/login', controller.login);

module.exports = router;

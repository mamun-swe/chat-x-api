const express = require('express')
const router = express.Router()
const AuthController = require('../controllers/AuthController')

// Auth routes
router.post('/register', AuthController.Register)
router.post('/login', AuthController.Login)
router.post('/reset', AuthController.Reset)



module.exports = router
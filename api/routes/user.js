const express = require('express')
const router = express.Router()
const UserController = require('../controllers/UserController')

// Auth routes
router.get('/index', UserController.Index)

module.exports = router
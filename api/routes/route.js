const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    res.send("Bad request")
});

module.exports = router
const User = require('../../models/User')
const jwt = require('jsonwebtoken')

// List of users
const Index = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]
        const decode = jwt.verify(token, 'SECRET')

        const results = await User.find({ _id: { $ne: decode.id } }, { userName: 1, email: 1 }).exec()

        res.status(200).json({
            status: true,
            users: results
        })
    } catch (error) {
        if (error) {
            console.log(error)
            next(error)
        }
    }
}



module.exports = {
    Index
}
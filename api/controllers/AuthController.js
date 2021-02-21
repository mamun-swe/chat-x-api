const User = require('../../models/User')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

// Register Account
const Register = async (req, res, next) => {
    try {
        const { userName, email, password } = req.body
        const check = await User.findOne({ email: email }).exec()

        if (check)
            return res.status(208).json({
                status: false,
                message: 'This email already used.'
            })

        // Password Hash
        const hashPassword = await bcrypt.hash(password, 10)

        // Create account object
        const newAccount = new User({
            userName: userName,
            email: email,
            password: hashPassword
        })

        // Save information
        const saveAccount = await newAccount.save()
        if (saveAccount)
            return res.status(201).json({
                status: true,
                message: "Successfully account created"
            })

    } catch (error) {
        if (error) next(error)
    }
}

// Login Account
const Login = async (req, res, next) => {
    try {
        const { email, password } = req.body

        // Account find using email 
        let account = await User.findOne({ email }).exec()

        // Compare with password
        if (account) {
            const result = await bcrypt.compare(password, account.password)
            if (result) {

                // Generate JWT token
                const token = await jwt.sign(
                    { id: account._id, userName: account.userName, role: account.role },
                    'SECRET', { expiresIn: '1d' }
                )

                if (token) {
                    return res.status(200).json({
                        status: true,
                        token
                    })
                }

                return res.status(404).json({
                    status: false,
                    message: 'Invalid e-mail or password'
                })

            }
            return res.status(404).json({
                status: false,
                message: 'Invalid e-mail or password'
            })
        }

        res.status(404).json({
            status: false,
            message: 'Invalid e-mail or password'
        })
    } catch (error) {
        if (error) next(error)
    }
}

// Reset Password
const Reset = async (req, res, next) => {
    try {
        const { email } = req.body

        console.log({ email, password })
    } catch (error) {
        if (error) next(error)
    }
}


module.exports = {
    Register,
    Login,
    Reset
}
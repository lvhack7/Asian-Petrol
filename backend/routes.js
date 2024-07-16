// routes.js
const express = require('express');
const User = require('./models/User')
const Deal = require('./models/Deal')
const { generateToken, hashPassword, comparePassword, verifyToken } = require('./auth');

const router = express.Router();

router.post('/register', async (req, res) => {
    const { login, password } = req.body;

    const hashedPassword = hashPassword(password)

    try {
        const user = await User.create({ login, password: hashedPassword });

        const payload = { id: user.id, login: user.login }
        res.status(201).json({ user: payload });
    } catch (error) {
        res.status(500).json({message: 'Error registering user'});
    }
});

router.post('/login', async (req, res) => {
    const { login, password } = req.body;

    try {
        const user = await User.findOne({ where: { login } });
        if (!user) return res.status(404).json({message: 'User not found'});
    
        const passwordIsValid = comparePassword(password, user.password)
        if (!passwordIsValid) return res.status(401).json({ auth: false, message: "Login or password incorrect!" });
        
        const payload = { id: user.id, login: user.login }
        const token = generateToken(payload)
        res.status(200).json({ user: payload, token });
    } catch (error) {
        res.status(500).json({message: 'Error logging in'});
    }
});

router.post("/deals", verifyToken, async (req, res) => {
    const {name, amount, currency, type} = req.body

    try {
        const deal = await Deal.create({
            name, amount, currency, type
        })
        res.status(200).json({deal})
    } catch (error) {
        res.status(500).json({message: 'Error logging in'});
    }
})

router.get("/deals", verifyToken, async (req, res) => {
    try {
        const deals = await Deal.findAll()
        res.status(200).json({deals})
    } catch (error) {
        res.status(500).json({message: 'Error logging in'});
    }
})

module.exports = router;
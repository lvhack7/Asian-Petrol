const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const {JWT_SECRET} = require('./consts')

function generateToken(user) {
  return jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: 86400 });
}

function hashPassword(password) {
  return bcrypt.hashSync(password, 8);
}

function comparePassword(password, hash) {
  return bcrypt.compareSync(password, hash);
}

function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ auth: false, message: 'No token provided.' });

  const token = authHeader.split(' ')[1];  // Extract the token after 'Bearer'
  if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).send({ auth: false, message: 'Failed to authenticate token.' });

    req.userId = decoded.id;
    next();
  });
}

module.exports = { generateToken, hashPassword, comparePassword, verifyToken };
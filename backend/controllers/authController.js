const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const {JWT_SECRET} = require('../consts')

exports.register = async (req, res) => {
  const { username, password, role } = req.body;
  let user = await User.findOne({ where: { username } });
  if (user) return res.status(400).json({ message: 'User already exists' });

  const salt = await bcrypt.genSalt(10);
  user = new User({
    username,
    password: await bcrypt.hash(password, salt),
    role
  });
  await user.save();

  res.json({ message: 'User registered successfully' });
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ where: { username } });
  if (!user) return res.status(400).json({ message: 'Invalid credentials' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
};
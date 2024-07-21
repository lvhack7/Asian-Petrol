const express = require('express');
const { createDeal, getDeals } = require('../controllers/dealController');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/', auth, createDeal);
router.get('/', auth, getDeals);

module.exports = router;
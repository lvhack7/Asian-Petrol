const express = require('express');
const { createDeal, getDeals, updateDeal } = require('../controllers/dealController');
const auth = require('../middleware/auth');
const router = express.Router();

router.put('/', auth, updateDeal);
router.post('/', auth, createDeal);
router.get('/', auth, getDeals);

module.exports = router;
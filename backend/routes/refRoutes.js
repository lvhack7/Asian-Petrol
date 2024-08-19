const express = require('express');
const { createRef, getRef, deleteRef } = require('../controllers/refController');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/', auth, createRef);
router.delete('/:id', auth, deleteRef);
router.get('/', auth, getRef);

module.exports = router;
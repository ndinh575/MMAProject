const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');

router.get('/', verifyToken, (req, res) => {
    res.json({ message: 'Bạn đã truy cập route bảo vệ!' });
});

module.exports = router;

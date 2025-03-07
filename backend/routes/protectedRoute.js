const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const verifyAdmin = require('../middleware/verifyAdmin');

router.get('/', verifyToken, verifyAdmin, (req, res) => {
    res.json({ message: 'Bạn đã truy cập route bảo vệ!', user: req.user });
});

module.exports = router;

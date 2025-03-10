const express = require('express');
const router = express.Router();
const multer = require("multer");
const verifyToken = require('../middleware/authMiddleware');
const verifyAdmin = require('../middleware/verifyAdmin');
const ProductController = require('../controllers/ProductController');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.route('/')
    .get(ProductController.getAllProducts)
    .post(verifyToken, verifyAdmin, upload.single('image'), ProductController.createProduct);
router.route('/:id')
    .get(ProductController.findProductById)
    .put(verifyToken, verifyAdmin, upload.single('image'), ProductController.updateProduct)
    .delete(verifyToken, verifyAdmin, ProductController.deleteProduct);

module.exports = router;
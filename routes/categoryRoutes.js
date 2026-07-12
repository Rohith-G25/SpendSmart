const express = require('express');
const router = express.Router();
const { getCategories, createCategory, updateCategory, deleteCategory, seedCategories } = require('../controllers/categoryController');
const { protect } = require('../middleware/auth');

router.use(protect); // Protect all routes in this router

router.get('/', getCategories);
router.post('/seed', seedCategories);
router.post('/', createCategory);
router.put('/:id', updateCategory);
router.delete('/:id', deleteCategory);

module.exports = router;

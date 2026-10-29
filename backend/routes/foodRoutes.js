const express = require('express');
const router = express.Router();
const Food = require('../models/Food');

// GET /api/foods - Lấy danh sách & Tìm kiếm
router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { category: { $regex: search, $options: 'i' } },
          { cuisine: { $regex: search, $options: 'i' } }
        ]
      };
    }
    const foods = await Food.find(query);
    res.status(200).json(foods);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
  }
});

// GET /api/foods/:id - Lấy chi tiết món ăn
router.get('/:id', async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) return res.status(404).json({ message: 'Không tìm thấy món ăn' });
    res.status(200).json(food);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
  }
});

// POST /api/foods - Thêm mới
router.post('/', async (req, res) => {
  try {
    const { foodId, name, category, cuisine, price, quantity } = req.body;
    if (!foodId || !name || !category || !cuisine || price == null || quantity == null) {
      return res.status(400).json({ message: 'Vui lòng nhập đầy đủ các trường bắt buộc' });
    }
    
    const existing = await Food.findOne({ foodId });
    if (existing) {
      return res.status(400).json({ message: 'Mã món ăn (foodId) đã tồn tại' });
    }

    const newFood = new Food(req.body);
    await newFood.save();
    res.status(201).json(newFood);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi thêm món ăn', error: error.message });
  }
});

// PUT /api/foods/:id - Cập nhật
router.put('/:id', async (req, res) => {
  try {
    const updatedFood = await Food.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updatedFood) return res.status(404).json({ message: 'Không tìm thấy món ăn' });
    res.status(200).json(updatedFood);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi cập nhật món ăn', error: error.message });
  }
});

// DELETE /api/foods/:id - Xóa
router.delete('/:id', async (req, res) => {
  try {
    const deletedFood = await Food.findByIdAndDelete(req.params.id);
    if (!deletedFood) return res.status(404).json({ message: 'Không tìm thấy món ăn' });
    res.status(200).json({ message: 'Xóa món ăn thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi xóa món ăn', error: error.message });
  }
});

module.exports = router;
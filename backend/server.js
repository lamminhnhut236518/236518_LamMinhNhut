const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const foodRoutes = require('./routes/foodRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// Endpoint kiểm tra sức khỏe hệ thống (/health)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Backend API đang hoạt động bình thường' });
});

app.use('/api/foods', foodRoutes);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Đã kết nối thành công với MongoDB Atlas!');
    app.listen(PORT, () => console.log(`Backend server đang chạy tại port ${PORT}`));
  })
  .catch(err => console.error('Lỗi kết nối MongoDB:', err));
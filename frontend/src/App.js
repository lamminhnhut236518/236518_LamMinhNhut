import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [foods, setFoods] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchFoods = async (search = '') => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:5000/api/foods?search=${search}`);
      setFoods(res.data);
    } catch (error) {
      console.error('Lỗi lấy dữ liệu:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFoods();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchFoods(searchTerm);
  };

  return (
    <div className="container">
      <div className="header">
        <h1>Quản Lý Món Ăn (Food Management)</h1>
      </div>

      <div className="student-info">
        <h3>Họ tên: Lâm Minh Nhựt - MSSV: 236518</h3>
      </div>

      <form className="search-box" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Tìm kiếm theo tên món, danh mục hoặc ẩm thực..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="submit" style={{ padding: '8px 16px', cursor: 'pointer' }}>
          Tìm kiếm
        </button>
      </form>

      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : (
        <div className="food-grid">
          {foods.length > 0 ? (
            foods.map((food) => (
              <div key={food._id} className="food-card">
                <img
                  src={food.imageUrl || 'https://via.placeholder.com/300x180?text=Food+Image'}
                  alt={food.name}
                />
                <h3>{food.name}</h3>
                <p><strong>Mã món:</strong> {food.foodId}</p>
                <p><strong>Danh mục:</strong> {food.category}</p>
                <p><strong>Ẩm thực:</strong> {food.cuisine}</p>
                <p className="price">Giá: {food.price?.toLocaleString('vi-VN')} VNĐ</p>
                <p><strong>Số lượng:</strong> {food.quantity}</p>
              </div>
            ))
          ) : (
            <p>Không tìm thấy món ăn nào!</p>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
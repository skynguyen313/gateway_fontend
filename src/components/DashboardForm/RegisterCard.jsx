import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import AxiosInstance from '../../utils/AxiosInstance';
import './RegisterCard.css';

const RegisterCard = () => {
  const [formData, setFormData] = useState({
    name: '',
    id_number: '',
    license_plate: '',
    activate: true,
    profile_image: null,
    uid: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    setFormData({
      ...formData,
      profile_image: e.target.files[0],
    });
  };

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080/');
    ws.onopen = () => {
      console.log('WebSocket connection established');
    };
    ws.onmessage = (event) => {

      try {
        const data = JSON.parse(event.data); // Parse JSON từ server
        console.log('Parsed data:', data); // Log dữ liệu sau khi parse
    
        if (data.uid) {
          setFormData((prevData) => ({
            ...prevData,
            uid: data.uid,
          }));
          toast.info(`UID mới nhận: ${data.uid}`);
        }

      } catch (err) {
        console.error('Error parsing WebSocket message:', err);
        toast.error('Dữ liệu nhận được không hợp lệ');
      }
    };
    
    ws.onerror = (error) => {
      console.error('WebSocket Error:', error);
      toast.error('Lỗi kết nối WebSocket');
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
    };

    return () => {
      ws.close(); // Đóng WebSocket khi component bị hủy
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Tạo formData để gửi kèm file
    const payload = new FormData();
    for (let key in formData) {
      payload.append(key, formData[key]);
    }
    console.log("Payload:", JSON.stringify(payload));  // Kiểm tra payload

    try {
      const response = await AxiosInstance.post('api/prove/person/', payload, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      if (response.status === 201) {
        console.log("Payload:", formData);
        toast.success('Đăng ký thành công!');
        setFormData({
          name: '',
          id_number: '',
          license_plate: '',
          activate: true,
          profile_image: null,
          uid: '',
        });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Đăng ký thất bại!');
    }
  };

  return (
    <div className="register-card-container">
      <h2>Đăng kí thẻ</h2>
      <form onSubmit={handleSubmit} className="register-card-form">
        <div className="form-group">
          <label htmlFor="name">Họ và tên:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="id_number">Số CCCD:</label>
          <input
            type="text"
            id="id_number"
            name="id_number"
            value={formData.id_number}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="license_plate">Biển số xe:</label>
          <input
            type="text"
            id="license_plate"
            name="license_plate"
            value={formData.license_plate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="profile_image">Ảnh:</label>
          <input
            type="file"
            id="profile_image"
            name="profile_image"
            accept="image/*"
            onChange={handleImageChange}
            required
          />
        </div>

        <div className="form-group">
        <label htmlFor="uid">UID:</label>
        <p className="uid-display">{formData.uid || 'Đang chờ nhận UID...'}</p>
        </div>

        <button type="submit" className="submit-button">Đăng ký</button>
      </form>
    </div>
  );
};

export default RegisterCard;

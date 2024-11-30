import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AxiosInstance from "../../utils/AxiosInstance";
import { toast } from 'react-toastify';
import './UserDetail.css';

const UserDetail = () => {
  const { uid } = useParams(); // Lấy UID từ URL
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    id_number: '',
    license_plate: '',
    activate: true,
    profile_image: null,
  });
  const navigate = useNavigate(); // Sử dụng useNavigate để điều hướng trang

  useEffect(() => {
    const fetchUserDetail = async () => {
      try {
        const response = await AxiosInstance.get(`api/prove/person/${uid}/`);
        setUser(response.data);
        setFormData({
          name: response.data.name,
          id_number: response.data.id_number,
          license_plate: response.data.license_plate,
          activate: response.data.activate,
          profile_image: null,
        });
      } catch (error) {
        console.error('Error fetching user detail:', error);
        toast.error("Lỗi khi tải thông tin người dùng");
      }
    };

    fetchUserDetail();
  }, [uid]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      profile_image: file,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('id_number', formData.id_number);
      formDataToSend.append('license_plate', formData.license_plate);
      formDataToSend.append('activate', formData.activate);
      if (formData.profile_image) {
        formDataToSend.append('profile_image', formData.profile_image);
      }

      const response = await AxiosInstance.patch(`api/prove/person/${uid}/`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Cập nhật thông tin người dùng thành công!');
      setUser(response.data); // Cập nhật lại thông tin người dùng
      navigate(`/user/${uid}`); // Điều hướng về trang chi tiết người dùng sau khi cập nhật thành công
    } catch (error) {
      console.error('Error updating user detail:', error);
      toast.error('Lỗi khi cập nhật thông tin người dùng');
    }
  };

  if (!user) return <p>Đang tải...</p>;

  return (
    <div className="user-details">
      <h2 className="user-title">Thông tin người dùng</h2>
      <div className="user-image-container">
        <img
          src={`${process.env.REACT_APP_API_BASE_URL}${user.profile_image}`}
          alt={user.name}
          className="user-image"
        />
      </div>
      <form onSubmit={handleSubmit}>
        <div className="user-info">
          <label>
            <strong>Họ và tên:</strong>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </label>
          <label>
            <strong>Số CCCD:</strong>
            <input
              type="text"
              name="id_number"
              value={formData.id_number}
              onChange={handleInputChange}
              required
            />
          </label>
          <label>
            <strong>Biển số xe:</strong>
            <input
              type="text"
              name="license_plate"
              value={formData.license_plate}
              onChange={handleInputChange}
              required
            />
          </label>
          <label>
            <strong>Profile Image:</strong>
            <input
              type="file"
              name="profile_image"
              onChange={handleFileChange}
            />
          </label>
          <label>
            <strong>Kích hoạt:</strong>
            <input
              type="checkbox"
              name="activate"
              checked={formData.activate}
              onChange={(e) => setFormData({ ...formData, activate: e.target.checked })}
            />
          </label>
        </div>
        <button type="submit" className="btn-submit">Cập nhật</button>
      </form>
    </div>
  );
};

export default UserDetail;

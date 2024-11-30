import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link từ React Router
import AxiosInstance from "../../utils/AxiosInstance";
import { toast } from 'react-toastify';
import './UserManagement.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Gọi API để lấy danh sách người dùng
    const fetchUsers = async () => {
      try {
        const response = await AxiosInstance.get('api/prove/person/');
        setUsers(response.data); // Lưu dữ liệu người dùng vào state
      } catch (error) {
        console.error('Error fetching users:', error);
        toast.error("Lỗi khi tải danh sách người dùng");
      }
    };

    fetchUsers();
  }, []);

  return (
    <div>
      <h2>Danh sách người dùng</h2>
      <table className="user-table">
        <thead>
          <tr>
            <th>UID</th>
            <th>HỌ VÀ TÊN</th>
            <th>Số CCCD</th>
            <th>BIỂN SỐ XE</th>
            <th>NGÀY ĐĂNG KÝ</th>
            <th>KÍCH HOẠT</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.uid}>
              <td>
                {/* Tạo link cho mỗi UID */}
                <Link to={`/user/${user.uid}`}>{user.uid}</Link>
              </td>
              <td>{user.name}</td>
              <td>{user.id_number}</td>
              <td>{user.license_plate}</td>
              <td>{user.date_joined}</td>
              <td>{user.activate ? 'Có' : 'Không'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;

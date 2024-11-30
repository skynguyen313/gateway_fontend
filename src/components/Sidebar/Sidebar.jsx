import {React, useEffect} from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AxiosInstance from "../../utils/AxiosInstance";
import './Sidebar.css';


  const Sidebar = ({setIsLoggedIn}) => {

  const navigate = useNavigate();
  const jwt = localStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user'))
  const refresh=JSON.parse(localStorage.getItem('refresh_token'))
  
  useEffect(() => {
    if (!jwt || !user) {
      navigate('/');
    }
  }, [jwt, user, navigate]); 

  const handleLogout = async () => {
    try {
      const res = await AxiosInstance.post('api/v1/auth/logout/', { 'refresh_token': refresh });
      if (res.status === 204) {
        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        setIsLoggedIn(false);
        navigate('/');
        toast.warn("Logout successful");
      }
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed. Please try again.");
    }
  };

  return (
    <div className="sidebar">
      {/* Menu chính */}
      <ul className="sidebar-menu">
        <li>
          <Link to="/home">Trang chủ</Link>
        </li>
        <li>
          <Link to="/register-card">Đăng kí thẻ</Link>
        </li>
        <li>
          <Link to="/user-management">Danh sách</Link>
        </li>
        <li>
          <Link to="/access-history">Lịch sử ra vào</Link>
        </li>
      </ul>

      {/* Nút logout */}
      <div className="sidebar-footer">
        <button className="logout-button" onClick={handleLogout}>
          Đăng xuất
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

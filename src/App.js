import React, { useState, useEffect } from 'react';
import './App.css';
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import Sidebar from './components/Sidebar/Sidebar';
import Login from './components/LoginForm/Login';
import Home from './components/DashboardForm/Home';
import AccessHistory from './components/DashboardForm/AccessHistory';
import UserManagement from './components/DashboardForm/UserManagement';
import RegisterCard from './components/DashboardForm/RegisterCard';
import UserDetail from './components/DashboardForm/UserDetail';

function App() {
  // Kiểm tra người dùng đã đăng nhập chưa
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    // Kiểm tra nếu có token trong localStorage, tức là đã đăng nhập
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <div className="App">
      <Router>
        <ToastContainer />
        {isLoggedIn ? (
          <div className="app-container">
            <Sidebar setIsLoggedIn={setIsLoggedIn} />
            <div className="main-content">
              <Routes>
                <Route path="/home" element={<Home />} />
                <Route path="/register-card" element={<RegisterCard />} />
                <Route path="/user-management" element={<UserManagement />} />
                <Route path="/access-history" element={<AccessHistory />} />
                <Route path="/user/:uid" element={<UserDetail />} /> 
                <Route path="*" element={<Navigate to="/home" />} />
              </Routes>
            </div>
          </div>
        ) : (
          <Routes>
            <Route path="/" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
            {/* Nếu chưa đăng nhập, mọi route khác điều hướng về trang Login */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        )}
      </Router>
    </div>
  );
}

export default App;
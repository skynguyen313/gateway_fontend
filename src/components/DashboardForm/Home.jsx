import React, { useState, useEffect } from 'react';
import AxiosInstance from '../../utils/AxiosInstance';
import './Home.css';

const Home = () => {
  const [uid, setUid] = useState('');
  const [entryInfo, setEntryInfo] = useState(null);
  const [exitInfo, setExitInfo] = useState(null);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080/');
    ws.onopen = () => {
      console.log('WebSocket connection established');
    };

    ws.onmessage = async (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('Parsed data:', data);

        if (data.value) {
          setUid(data.value);
        }
      } catch (err) {
        console.error('Error parsing WebSocket message:', err);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket Error:', error);
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
    };

    return () => {
      ws.close();
    };
  }, []);


  useEffect(() => {
    if (uid) { // Kiểm tra nếu uid đã có giá trị
      const fetchUserData = async () => {
        try {
          console.log("Fetching data for UID:", uid);
          const response = await AxiosInstance.get(`api/prove/person/${uid}/`);
          console.log('Response data:', response.data); // Thêm log để kiểm tra phản hồi từ API
          if (response.status === 200) {
            if (response.data.name === 'rfid1') {
              setEntryInfo(response.data);
              console.log('Entry Info Updated:', response.data);
            } else if (response.data.name === 'rfid2') {
              setExitInfo(response.data);
              console.log('Exit Info Updated:', response.data);
            }
          }
        } catch (error) {
          console.error('Error fetching user data from server:', error);
        }
      };

      fetchUserData();
    }
  }, [uid]);

  const renderUserInfo = (userInfo) => {
    if (!userInfo) {
      return <p>Chưa nhận thông tin người dùng</p>;
    }
    console.log('Rendering userInfo:', userInfo);
    return (
      <div>
        <p><strong>Tên:</strong> {userInfo.name}</p>
        <p><strong>Số CMND:</strong> {userInfo.id_number}</p>
        <p><strong>Biển số xe:</strong> {userInfo.license_plate}</p>
        <p><strong>Ngày tham gia:</strong> {userInfo.date_joined}</p>
        <p><strong>Kích hoạt:</strong> {userInfo.activate ? 'Có' : 'Không'}</p>
        {userInfo.profile_image && (
          <img
            src={userInfo.profile_image}
            alt="Profile"
            className="profile-image"
          />
        )}
      </div>
    );
  };

  return (
    <div className="home-container">
      <div className="left-panel">
        <h2>Thông tin cửa vào</h2>
        {renderUserInfo(entryInfo)}
      </div>
      <div className="right-panel">
        <h2>Thông tin cửa ra</h2>
        {renderUserInfo(exitInfo)}
      </div>
      <div className="uid-display">
        <h3>UID nhận được:</h3>
        <p>{uid || 'Chưa nhận UID'}</p>
      </div>
    </div>
  );
};

export default Home;

import React, { useState, useEffect } from 'react';
import AxiosInstance from '../../utils/AxiosInstance';
import './Home.css';

const Home = () => {
  const [uid, setUid] = useState('');
  const [name, setName] = useState('');
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
          setName(data.name);
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
    if (uid) {
      const fetchUserData = async () => {
        try {
          console.log("Fetching data for UID:", uid);
          const response = await AxiosInstance.get(`api/prove/person/${uid}/`);
          console.log('Response data:', response.data);

          if (response.status === 200) {
            if (name === 'rfid1') {
              setEntryInfo(response.data);
            } else if (name === 'rfid2') {
              setExitInfo(response.data);
            }
          }
        } catch (error) {
          console.error('Error fetching user data from server:', error);
        }
      };

      fetchUserData();
    }
  }, [uid, name]);

  const renderUserInfo = (userInfo) => {
    if (!userInfo) {
      return <p>Chưa nhận thông tin người dùng</p>;
    }

    const imageUrl = userInfo.profile_image
      ? `${process.env.REACT_APP_API_BASE_URL}${userInfo.profile_image}`
      : null;

    return (
      <div className="user-info">
        {imageUrl && (
          <img
            src={imageUrl}
            alt={userInfo.name}
            className="profile-image"
          />
        )}
        <p><strong>Tên:</strong> {userInfo.name}</p>
        <p><strong>Số CMND:</strong> {userInfo.id_number}</p>
        <p><strong>Biển số xe:</strong> {userInfo.license_plate}</p>
        <p><strong>Ngày tham gia:</strong> {userInfo.date_joined}</p>
        <p><strong>Kích hoạt:</strong> {userInfo.activate ? 'Có' : 'Không'}</p>
        
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
    </div>
  );
};

export default Home;

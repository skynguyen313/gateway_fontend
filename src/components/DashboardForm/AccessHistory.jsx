import React, { useState, useEffect } from 'react';
import AxiosInstance from '../../utils/AxiosInstance';  // Đảm bảo đường dẫn này chính xác
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";  // Import CSS của react-datepicker
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';  // Import Link từ react-router-dom
import './AccessHistory.css';

const AccessHistory = () => {
  const [histories, setHistories] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());  // Mặc định là ngày hôm nay
  const [loading, setLoading] = useState(false);

  // Hàm để gọi API và lấy dữ liệu
  const fetchHistory = async (date) => {
    setLoading(true);
    const formattedDate = date.toISOString().split('T')[0];  // Chuyển đổi ngày sang định dạng YYYY-MM-DD
    try {
      const response = await AxiosInstance.get(`api/prove/history/${formattedDate}/`);
      setHistories(response.data);  // Lưu dữ liệu vào state
    } catch (error) {
      toast.error("Không tìm thấy lịch sử cho ngày này!");
      setHistories([]);  // Reset dữ liệu khi có lỗi
    } finally {
      setLoading(false);
    }
  };

  // Hàm gọi API khi chọn ngày mới
  const handleDateChange = (date) => {
    setSelectedDate(date);
    fetchHistory(date);  // Lọc dữ liệu theo ngày đã chọn
  };

  // Lần đầu tiên load dữ liệu khi component mount
  useEffect(() => {
    fetchHistory(selectedDate);
  }, [selectedDate]);

  return (
    <div className="access-history-container">
      <h2>Lịch sử ra vào</h2>

      {/* Chọn ngày */}
      <div className="date-picker-container">
        <label><strong>Chọn ngày:</strong></label>
        <DatePicker
          selected={selectedDate}
          onChange={handleDateChange}
          dateFormat="yyyy-MM-dd"
          className="date-picker"
        />
      </div>

      {/* Hiển thị dữ liệu */}
      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : (
        <div className="history-list">
          {histories.length > 0 ? (
            <div className="scrollable-container">
              <table className="history-table">
                <thead>
                  <tr>
                    <th>UID</th>
                    <th>Thời gian</th>
                    <th>Cổng</th>
                  </tr>
                </thead>
                <tbody>
                  {histories.map((history) => (
                    <tr key={history.id}>
                      {/* UID là một liên kết với Link */}
                      <td>
                        <Link to={`/user/${history.person}`}>{history.person}</Link>
                      </td>
                      <td>{new Date(history.timeline).toLocaleString()}</td>
                      <td>{history.gate ? 'Đi vào' : 'Đi ra'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>Không có lịch sử cho ngày này.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default AccessHistory;

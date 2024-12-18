import axios from "axios";
import { jwtDecode } from 'jwt-decode';
import dayjs from "dayjs";

// Lấy access token và refresh token từ localStorage
let accessToken = localStorage.getItem('token') ? JSON.parse(localStorage.getItem('token')) : "";
let refreshToken = localStorage.getItem('refresh_token') ? JSON.parse(localStorage.getItem('refresh_token')) : "";
console.log('Access Token:', accessToken);

// Đặt baseURL cho axios instance
const baseURL = process.env.REACT_APP_API_BASE_URL;

// Tạo một instance của axios với các cấu hình ban đầu
const AxiosInstance = axios.create({
    baseURL: baseURL,
    headers: { 'Content-type': 'application/json' },
});

// Thêm interceptor cho request để xử lý token
AxiosInstance.interceptors.request.use(
    
    async (req) => {
        if (accessToken) {
            req.headers.Authorization = localStorage.getItem('token') ? `Bearer ${accessToken}` : "";
            const user = jwtDecode(accessToken);
            const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1;

            // Nếu token chưa hết hạn, tiếp tục request
            if (!isExpired) return req;

            // Token hết hạn -> gọi API để refresh token
            try {
                const resp = await axios.post(`${baseURL}api/v1/token/refresh/`, {
                    refresh: refreshToken
                });

                console.log('new_accesstoken: ', resp.data.access);
                localStorage.setItem('token', JSON.stringify(resp.data.access));
                req.headers.Authorization = `Bearer ${resp.data.access}`;
                return req;
            } catch (error) {
                // Refresh token không hợp lệ hoặc hết hạn
                console.error("Refresh token expired or invalid:", error);

                // Xóa token khỏi localStorage
                localStorage.removeItem('token');
                localStorage.removeItem('refresh_token');

                // Điều hướng về trang đăng nhập
                window.location.href = '/';
                return Promise.reject(error);
            }
        } else {
            req.headers.Authorization = localStorage.getItem('token') ? `Bearer ${JSON.parse(localStorage.getItem('token'))}` : " ";
            return req;
        }
    },
    (error) => {
        console.error("Error in request interceptor:", error);
        return Promise.reject(error);
    }
);

export default AxiosInstance;

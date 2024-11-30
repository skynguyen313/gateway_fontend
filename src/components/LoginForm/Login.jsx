import React, { useState} from 'react'
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import AxiosInstance from "../../utils/AxiosInstance";
import './Login.css';

const Login = ({ setIsLoggedIn }) => {
    const navigate=useNavigate()
    const [logindata, setLogindata]=useState({
        email:"",
        password:""
    })

    const handleOnchange=(e)=>{
        setLogindata({...logindata, [e.target.name]:e.target.value})
    }

    const handleSubmit = async(e)=>{
        e.preventDefault()
        if (logindata) {
             const res = await AxiosInstance.post('api/v1/auth/login/', logindata)
             const response= res.data
             const user={
                'full_name':response.full_name,
                'email':response.email
             }
               
             if (res.status === 200) {
                localStorage.setItem('token', JSON.stringify(response.access_token))
                localStorage.setItem('refresh_token', JSON.stringify(response.refresh_token))
                localStorage.setItem('user', JSON.stringify(user))
                setIsLoggedIn(true);
                navigate('/home')
                toast.success('login successful')
             }else{
                toast.error('something went wrong')
             }
        }    
    }

    return (
        <div className="form-container">
          <div className="wrapper">
            <h2>Login into your account</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email">Email Address:</label>
                <input
                  type="email"
                  className="email-form"
                  value={logindata.email}
                  name="email"
                  onChange={handleOnchange}
                />
              </div>
      
              <div className="form-group">
                <label htmlFor="password">Password:</label>
                <input
                  type="password"
                  className="email-form"
                  value={logindata.password}
                  name="password"
                  onChange={handleOnchange}
                />
              </div>
      
              <input type="submit" value="Login" className="submitButton" />
            </form>
          </div>
        </div>
      );
}
export default Login
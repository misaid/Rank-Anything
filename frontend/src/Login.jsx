import { useState } from 'react'
import { Link } from  "react-router-dom"
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [invalid, setInvalid] = useState(false);
  const navigate = useNavigate();

  const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_APP_API_URL,
  }); 
  const handleTempUser = async (event) => {
    try {
      await axiosInstance.post('/tempuser',{}, {withCredentials: true});
      navigate('/')
    }
    catch (error) {
      console.log("Failed to login as guest")
    }
  }
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axiosInstance.post('/login',{username, password},
      {
        withCredentials: true
      }
      );
      navigate('/')
    } catch (error) {
      // notify the user that login failed
      setInvalid(true);
      console.log("Login failed")
    }
  };
  const handleRegister = async (event) => {
    navigate('/register')
  }
  return (
    <div className="flex justify-center items-center h-screen bg-slate-400">
      <div className="bg-white p-3 rounded w-25">
        <h2 className='mb-2 text-2xl'>Login</h2>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex items-center mb-1 ">
            <label htmlFor='email' className='mr-2'>
              <strong>Username</strong>
            </label>
            <input type="text"
              placeholder="Enter username"
              autoComplete="off"
              name="email"
              className="w-full px-3 py-2 border border-gray-300 rounded" 
              onChange={(e) => setUsername(e.target.value)}
              />
          </div>
          <div className="flex items-center">
            <label htmlFor='password' className='mr-2'>
              <strong>Password</strong>
            </label>
            <input type="password"
              placeholder="Enter password"
              autoComplete="off"
              name="password"
              className="w-full px-3 py-2 border border-gray-300 rounded" 
              onChange={(e) => setPassword(e.target.value)}/>
          </div>
          {invalid && ( <p className='text-red-500'>Invalid username or password</p>)}
          <button type='submit' className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>
            Login
          </button>
          <button className='bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded' onClick={handleRegister}>
            Register
          </button>
          <div className='select-none' onClick={handleTempUser}>
          <h2 className='text-gray-500 hover:text-gray-700 font-bold pt-2 pb-1 px-4 border-b border-gray-500' >
            Continue as Guest
          </h2></div>
        </form>
      </div>
    </div>
  )
}


export default Login
import { useState } from 'react'
import { Link } from  "react-router-dom"
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('https://msaid.dev/api/login',{username, password});
      const{ token } = response.data;
      localStorage.setItem('token', token);
      navigate('/home')
    } catch (error) {
      console.log("Login failed")
    }
    
    // .then(result => {
    //   if (result.data = "Sucesss!") {
    //     navigate('/home')
    //   }
    // })
    // .catch(error=> console.log(error))
  };
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
          <div className="flex items-center mb-4">
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
          <button type='submit' className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>
            Login
          </button>
          <button className='bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded'>
            Register
          </button>
        </form>
      </div>
    </div>
  )
}


export default Login
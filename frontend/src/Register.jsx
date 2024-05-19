import { useState } from 'react';
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Validation from './Validation'

/**
 * This is the register component that will allow the user to register
 * @returns The registration component
 */
function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [password1, setPassword1] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();


  const handleSubmit = (event) => {
    event.preventDefault();
    if (password === password1) {
      axios.post('http://localhost:5555/register', { username, password })
        .then(result => {
          console.log(result)
          navigate('/login')
        })
        .catch(error => console.log(error))
    } else {
      // show user indication of passowrds not matching
      console.log("passwords do not match");
    }
  };

  const handleValidation = (event) => {
    event.preventDefault();
    setErrors(Validation(username, password, password1))

    // If there are no errors
    if (Object.keys(errors).length === 0) {
      handleSubmit(event);
    }
  };
  return (
    <div className="flex justify-center items-center h-screen bg-slate-400">
      <div className="bg-white p-3 rounded w-25">
        <h2 className='mb-2 text-2xl'>Register</h2>
        <form className="flex flex-col gap-4" onSubmit={handleValidation}>
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
          {errors.username && <p style={{ color: "red" }}>{errors.username}</p>}
          <div className="flex items-center mb-1">
            <label htmlFor='password' className='mr-2'>
              <strong>Password</strong>
            </label>
            <input type="password"
              placeholder="Enter password"
              autoComplete="off"
              name="password"
              className="w-full px-3 py-2 border border-gray-300 rounded"
              onChange={(e) => setPassword(e.target.value)} />

          </div>{errors.password && <p style={{ color: "red" }}>{errors.password}</p>}
          <div className="flex items-center mb-1">
            <label htmlFor='password' className='mr-2'>
              <strong>Password</strong>
            </label>
            <input type="password"
              placeholder="Enter password"
              autoComplete="off"
              name="password2"
              className="w-full px-3 py-2 border border-gray-300 rounded"
              onChange={(e) => setPassword1(e.target.value)} />

          </div> {errors.password1 && <p style={{ color: "red" }}>{errors.password1}</p>}
          <a href='/login'>Already have an account?</a>
          <button type="submit" className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>
            Register
          </button>
        </form>
      </div>
    </div>
  )
}


export default Register
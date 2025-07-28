import axios from 'axios';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  let navigate = useNavigate()

  async function handleSubmit(e){
    e.preventDefault()
    try{
        let response = await axios.post('http://localhost:8000/api/login',formData)

        console.log(response.data);
        localStorage.setItem('token',response.data.token)
        localStorage.setItem('user',JSON.stringify(response.data.user))
        navigate('/home')
    }catch(err){
        if(err.status == 429){
            alert("Too many requests! Try again after 1 min!")
        }
        console.error(err.message);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-4">
      <div className="w-full max-w-xs">
        <h1 className="text-2xl font-light mb-6 text-center">Sign In</h1>
        
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <input
              type="email"
              placeholder="Email"
              className="w-full p-2 border-b border-gray-300 focus:border-black outline-none"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>
          
          <div>
            <input
              type="password"
              placeholder="Password"
              className="w-full p-2 border-b border-gray-300 focus:border-black outline-none"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-black text-white py-2 hover:bg-gray-800 transition"
          >
            Sign In
          </button>
        </form>
        
        <div className="mt-4 text-center text-sm space-y-2">
          <p className="text-gray-600">
            Don't have an account? <Link to="/register" className="text-black underline">Sign up</Link>
          </p>
          <p>
            <Link to="/forgot-password" className="text-gray-600 hover:text-black">Forgot password?</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
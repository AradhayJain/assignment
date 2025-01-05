import React, { useEffect, useState } from 'react';
import { useContext } from '../context/Context';
import { ToastContainer,toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const Login = () => {
//   const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const navigate=useNavigate();
  const {user,setUser}=useContext();

  useEffect(()=>{
    const token=localStorage.getItem("token");
    if(token){
        navigate("/profile");
    }
    },[navigate])

  const handleLogin = async () => {
    // Simulate login logic (you can replace this with actual API call)
    if(!email || !password){
        toast.error("Please fill all the fields");
        return;
    }
    try{
        const config={
            headers:{
                "Content-Type":"application/json"
            }
        }
        const {data}=await axios.post("/api/user/login",{email,password},config);
        if(data){
            console.log(data);
            setUser(data);
            localStorage.setItem("userInfo",JSON.stringify(data));
            localStorage.setItem("token",data.token);
            toast.success("User logged in successfully");
            navigate("/profile");
            
        }
    }catch(error){
        console.log(error);
        toast.error("Invalid credentials");
    }
  };

  

  return (
    <div className='flex flex-col justify-center items-center'>
        <ToastContainer/>
      <h2 className='text-2xl font-bold'>Login</h2>
      <div className='p-3 mt-6'>
        
      <label className='text-lg'>email</label>
      <input className='w-64 h-10 rounded-full p-1'
        type="email"
        placeholder="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <label className='text-lg'>password</label>
      <input className='w-64 h-10 rounded-full p-1'
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      </div>
      
      <button className='bg-yellow-200 p-2 rounded-full w-36 mt-8 h-10' onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;

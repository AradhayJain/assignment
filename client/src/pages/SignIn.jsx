import React, { useEffect } from 'react'
import { useContext } from '../context/Context'
import axios from 'axios'
import { ToastContainer,toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
const SignIn = () => {
    const [username, setUsername] = React.useState('')
    const [email, setEmail] = React.useState('')
    const [password, setPassword] = React.useState('')
    const navigate=useNavigate();
    const {user,setUser}=useContext();

    useEffect(()=>{
        const token=localStorage.getItem("token");
        if(token){
            navigate("/profile");
        }
        },[navigate])
    const handleSignUp = async () => {
        const data1={
            "name":username,
            "email":email,
            "password":password
        }
        const config={
            headers:{
                "Content-Type":"application/json"
            }
        }
        const {data}= await axios.post("/api/user",data1,config);
        if(data){
            toast.success("User created successfully");
            setUser(data);
            localStorage.setItem("userInfo",JSON.stringify(data));
            localStorage.setItem("token",data.token);
            navigate("/profile");

        }else{
            toast.error("User not created successfully");
            
        }


    }
  return (
    <div className='flex flex-col justify-center items-center'>
        <ToastContainer/>
      <h2 className='text-2xl font-bold'>SignUp</h2>
      <div className='p-3 mt-3'>
        <label className='text-lg'>Username</label>
      <input className='w-64 h-10 rounded-full p-1'
      
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
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
      
      <button className='bg-yellow-200 p-2 rounded-full w-36 mt-2 h-10' onClick={handleSignUp}>SignUp</button>
    </div>
  )
}

export default SignIn
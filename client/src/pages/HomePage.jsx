import React from 'react'
import Login from './Login'
import SignIn from './SignIn'

const HomePage = () => {
    const [isLogin, setIsLogin] = React.useState(false)
    const handleSignIn = () => {
        setIsLogin(false)
    }
    const handleLogin = () => {
        setIsLogin(true)
    }

  return (
    <div className='h-screen w-full flex justify-center items-center bg-black'>
        <div className='h-96 flex flex-col w-80 bg-red-400'>
            <div className='border-green-400 border-4 h-10 flex justify-evenly items-center bg-slate-200 m-1 rounded-full'>
                    <button onClick={handleSignIn}>SingUp</button>
                    <button onClick={handleLogin}>Login</button>
            </div>
            <div className='h-full m-2 rounded-lg bg-green-400'>
                {isLogin?<Login/>:<SignIn/>}
            </div>
        </div>
    </div>
  )
}

export default HomePage
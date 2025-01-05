import React, { useEffect } from 'react'
import { useContext } from '../context/Context'
import axios from 'axios';

const Hex = () => {
    const {user,setUser,token,isSidebarOpen,friendRequests,setFriendRequests,fetchAgain,setSelectedUser,selectedUser}=useContext();


    const fetchRequests=async()=>{
        const config={
            headers:{
                "Authorization":`Bearer ${token}`
            }
        }
        try {
            const {data}=await axios.get("/api/user/allrequests",config);
            if(data){
                console.log(data);
                setFriendRequests(data);

            }
            else{
                console.log("error");
            }

            
        } catch (error) {
            console.log(error);
            
        }
    }
    const handleAddFriend=async(request)=>{
        const userId=request._id;
        const config={
            headers:{
                "Authorization":`Bearer ${token}`
            }

        }
        try {
            const {data}=await axios.put(`/api/user/${userId}/accept`,{},config);
            if(data){
                console.log(data);
                setUser((prevUser) => ({
                    ...prevUser,
                    friends: [...(prevUser?.friends || []), selectedUser?._id],
                  }));
                  
                setSelectedUser(null)

            }
        } catch (error) {
            console.log(error);
        }
    }
    const handleReject=async(request)=>{
        const userId=request._id;
        const config={
            headers:{
                "Authorization":`Bearer ${token}`
            }
        }
        try{
            const {data}=await axios.put(`/api/user/${userId}/reject`,{},config);
            if(data){
                console.log(data);
                setFriendRequests(friendRequests.filter((request)=>request._id!==userId));
                setUser((prevUser) => ({
                    ...prevUser,
                    friendRequests: friendRequests?.filter((request)=>request._id!==user?._id)
                  }));
                setSelectedUser(null)
                  
            }
            else{
                console.log("error");
            }
            

        }
        catch(error){
            console.log(error);
        }
    }


    useEffect(()=>{
        if(user){
            console.log(user)
            fetchRequests();
        }
    },[user])

    
  return (

    <div className={`h-full ${isSidebarOpen? "w-[60%] lg:w-full" : "w-full"} flex justify-center items-center `}>
        <div className='w-full h-full p-10 flex flex-col items-center  gap-20'>
            <h1 className='text-5xl bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% bg-clip-text text-transparent'>Friend requests</h1>

            <div className='flex flex-col gap-5'>{friendRequests.length>0?
                friendRequests.map((request,index)=>(
                    <div className='flex lg:flex-row flex-col  gap-5'>
                    <div className="bg-zinc-200 lg:w-80 w-32 h-14 p-3 rounded-full items-center justify-evenly flex " key={index}>
                        <h1>{request.name}</h1>
                       

                    </div>
                    <button onClick={()=>handleAddFriend(request)} className='h-10 w-32 mt-2 bg-green-100 rounded-full flex items-center justify-center p-5'>Accept</button>
                    <button onClick={()=>handleReject(request)} className='h-10 w-32 mt-2 bg-green-100 rounded-full flex items-center justify-center p-5'>Reject</button>
                    </div>
                ))
                

            :<h1 className='text-center mt-20 text-2xl ml-3 font-semibold italic'>No Friend Requests</h1>}</div>
            
            

        </div>
        


    </div>
  )
}

export default Hex
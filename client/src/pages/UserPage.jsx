import React, { useEffect } from 'react'
import { useContext } from '../context/Context';
import axios from 'axios';
import {ToastContainer,toast} from "react-toastify"

const UserPage = () => {
    const {user,isSidebarOpen,setUser,selectedUser,setSelectedUser,value,setValue,fetchAgain,setFetchAgain,setFriendRequests} = useContext();
    const [getSuggestedUsers, setGetSuggestedUsers] = React.useState([]);
    const handleText = () => {
        
        
      
        if (user?.friends?.includes(selectedUser?._id)) {
          setValue("Remove Friend");
        } else if (selectedUser?.friendRequests?.includes(user?._id)) {
          setValue("Request Sent");
        } else if(user?.friendRequests?.includes(selectedUser?._id)) {
          setValue("Request Received");
        }
        else{
            setValue("Add Friend");
        }
      };
      const handleRequestReceived=async ()=>{
        console.log(value)
        const userId=selectedUser?._id;
        const config={
            headers:{
                "Authorization":`Bearer ${user?.token}`
            }

        }
        try {
            const {data}=await axios.put(`/api/user/${userId}/accept`,{},config);
            if(data){
                console.log(data);
                
                setUser((prevUser) => ({
                  ...prevUser,
                  friends: [...(prevUser?.friends || []), selectedUser?._id],
                  friendRequests:prevUser?.friendRequests?.filter((request)=>request?._id!==selectedUser._id)
                }));
                setSelectedUser((prevUser) => ({
                  ...prevUser,
                  friends: [...(prevUser?.friends || []), user?._id],
                }));
                
                
                setSelectedUser(null)
                setFetchAgain(!fetchAgain)
            }
        } catch (error) {
            console.log(error);
        }

      }
    const handleRemoveFriend = async () => {
        const config = {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        };
      
        if (!selectedUser?._id) {
          toast.error("No user selected to remove.");
          return;
        }
      
        try {
          const { data } = await axios.put(`/api/user/${selectedUser?._id}/remove`, {}, config);
          toast.success("Friend removed successfully");
          setUser((prevUser)=>({
            ...prevUser,
            friends: prevUser?.friends?.filter((friendId) => friendId !== selectedUser?._id)
          }))
          setSelectedUser((prevUser)=>({
            ...prevUser,
            friends: prevUser?.friends?.filter((friendId) => friendId !== user?._id)
          }))
          console.log(user)
          setFetchAgain(!fetchAgain)
          setSelectedUser(null);
          console.log(data)


        } catch (error) {
          console.error(error);
          toast.error(error.response?.data?.message || "Error removing friend");
        }
      };
      
      const handleAddFriend = async () => {
        const config = {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        };
      
        if (!selectedUser?._id) {
          toast.error("No user selected to add.");
          return;
        }
      
        try {
          const { data } = await axios.put(`/api/user/${selectedUser._id}/request`, {}, config);
          toast.success("Friend request sent");
        } catch (error) {
          console.error(error);
          toast.error(error.response?.data?.message || "Error sending friend request");
          setSelectedUser((prevUser)=>({
            ...prevUser,
            friendRequests: [...prevUser.friendRequests || [], user?._id ],
          })

          )
          setFetchAgain(!fetchAgain)
          setSelectedUser(null)

        }
      };
      
      const handleButton = async () => {
        if (!value) {
          toast.error("Invalid action value.");
          return;
        }
      
        if (value == "Remove Friend") {
          await handleRemoveFriend();
        } else if (value == "Add Friend") {
          await handleAddFriend();

        
        }else if(value==="Request Received"){
            handleRequestReceived();
        }
         else {
          toast.error("Unknown action.");
        }
        
      };
      
    useEffect(()=>{
        handleText();
        console.log(value)
    },[selectedUser,user,fetchAgain])

    const fetchSuggestedUsers=async()=>{
        const config={
            headers:{
                "Authorization":`Bearer ${user?.token}`
            }
        }
        try{
            const {data}=await axios.get('/api/user/suggested',config);
            if(data){
                console.log(data);
                setGetSuggestedUsers(data);
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
            fetchSuggestedUsers();
        }
    },[user])

    
    
  return (
    <>
    <ToastContainer/>

    {
        selectedUser===null && (

            <div className={`h-full ${isSidebarOpen? "w-[60%] lg:w-full" : "w-full"}  bg-red-200 flex lg:flex-row flex-col`}>
                <div className={`${isSidebarOpen?"pl-4":"pl-20"} w-[60%] items-center pt-10 flex flex-col`}>
                    <img className='h-32 w-32 rounded-full' src={user?.pic} alt="" />

                    <h1 className='mt-5 text-2xl font-semibold italic'>{user?.name}</h1>
                    <h1 className='text-xl'>{user?.email}</h1>
        
                </div>
                <div className='pt-10 ml-10  w-[30%] lg:w-full flex flex-col gap-5 items-center pl-10' >
                    <h1 className='text-lg font-bold italic w-36'>Suggested Users</h1>
                    {
                        getSuggestedUsers.slice(0,4).map((user,index)=>(
                            <div key={index} className=' ml-4 bg-white rounded-full p-5 w-64 h-20 lg:w-[30%] justify-between flex gap-10 items-center'>
                                <div className='flex  gap-5 items-center'>
                                <img className='h-12 w-12 rounded-full' src={user?.pic} alt="" />
                                <h1 className='text-md'>{user?.name}</h1>
                                </div>
                                
                                
                            </div>
                        ))
                    }
                </div>
    
    
            </div>
        )
    }
    
    {
        selectedUser && (

            <div className='h-full w-full bg-red-200'>
                <div className='w-full flex justify-flex-end items-end p-5'>
                <button onClick={()=>handleButton()} className=' h-10 rounded-full bg-green-100 px-3 py-2'>{value}</button>
                </div>
                

                <div className=' w-full items-center pt-10 flex flex-col'>
                    <img className='h-32 w-32 rounded-full' src={selectedUser?.pic} alt="" />

                    <h1 className='mt-5 text-2xl font-semibold italic'>{selectedUser?.name}</h1>
                    <h1 className='text-xl'>{selectedUser?.email}</h1>
        
                </div>
    
    
            </div>
        )
    }
    </>
   
    
  )
}

export default UserPage
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Context = React.createContext();
export const useContext=()=>{
    return React.useContext(Context);
}

const ContextProvider = ({children})=>{
    const navigate=useNavigate();
    const [user,setUser] = React.useState(null);
    const [loggedIn,setLoggedIn] = React.useState(false);
    const [token,setToken] = React.useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
    const [friendRequests,setFriendRequests] = React.useState([]);
    const [selectedUser,setSelectedUser] = React.useState(null);
    const [fetchAgain,setFetchAgain]=useState(false)
    const [value,setValue]=React.useState("");

    useEffect(()=>{
        const userInfo = localStorage.getItem("userInfo");
        const tokenInfo = localStorage.getItem("token");
        
        if(userInfo){
            setUser(JSON.parse(userInfo));
            setToken(tokenInfo);
        }
        else{
            navigate("/")
        }
    },[navigate])

    return(
        <Context.Provider value={{user,setUser,loggedIn,setLoggedIn,isSidebarOpen,setIsSidebarOpen,friendRequests,setFriendRequests,token,selectedUser,setSelectedUser,fetchAgain,setFetchAgain,value,setValue}}>
            {children}
        </Context.Provider>
    )
}
export default ContextProvider


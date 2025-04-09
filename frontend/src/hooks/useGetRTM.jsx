import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
// import axios from "axios";
// import { setPosts } from "@/redux/postSlice";
import { setMessages } from "@/redux/chatSlice";
// import { setSelectedUser } from "@/redux/authSlice";
// import { setPosts } from "@/redux/postSlice";


const useGetRTM = () =>{
    const dispatch = useDispatch(); 
    const {socket} =useSelector(store=> store.socketio)
    const {messages} =useSelector(store=> store.chat)
    useEffect (()=>{
        socket?.on('newMessage',(newMessage)=>{
            dispatch(setMessages([...messages, newMessage]))

        })

        return ()=>{
            socket?.off('newMessage')
        }
    },[messages,setMessages]);

};
export default useGetRTM;
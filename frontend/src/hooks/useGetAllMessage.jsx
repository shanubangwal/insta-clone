import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
// import { setPosts } from "@/redux/postSlice";
import { setMessages } from "@/redux/chatSlice";
// import { setPosts } from "@/redux/postSlice";


const useGetAllMessage = () =>{
    const dispatch = useDispatch(); 
    const {selectedUser} = useSelector(store=>store.auth)
    useEffect (()=>{
        const fetchAllMessage = async ()=>{
            try {
                const res = await axios.get(`https://connect-to.onrender.com/api/v1/message/all/${selectedUser?._id}`,{withCredentials:true});
                if(res.data.success){
                    // console.log(res.data.posts)//
                    dispatch(setMessages(res.data.messages))

                }
                
            } catch (error) {
                console.log(error)
                
            }
        }
        fetchAllMessage();
    },[selectedUser,dispatch]);

};
export default useGetAllMessage;
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
// import { setPosts } from "@/redux/postSlice";
import { setSuggestedUsers } from "@/redux/authSlice";
// import { setPosts } from "@/redux/postSlice";


const useGetSuggestedUsers = () =>{
    const dispatch = useDispatch(); 
    useEffect (()=>{
        const fetchSuggestedUsers = async ()=>{
            try {
                const res = await axios.get('http://localhost:8000/api/v1/user/suggested',{withCredentials:true});
                if(res.data.success){

                    // console.log(res.data.posts)//
                    dispatch(setSuggestedUsers(res.data.users))

                    
                }
                
            } catch (error) {
                console.log(error)
                
            }
        }
        fetchSuggestedUsers();
    },[]);

};
export default useGetSuggestedUsers;
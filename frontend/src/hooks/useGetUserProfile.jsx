import { useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
// import { setPosts } from "@/redux/postSlice";
import { setUserProfile } from "@/redux/authSlice";
// import { setPosts } from "@/redux/postSlice";


const useGetUserProfile = (userId) =>{
    const dispatch = useDispatch(); 
    // const [userProfile,setUserProfile] = useState();//
    useEffect (()=>{
        const fetchUserProfie = async ()=>{
            try {
                const res = await axios.get(`https://connect-to.onrender.com/api/v1/user/${userId}/profile`,{withCredentials:true});
                if(res.data.success){

                    // console.log(res.data.posts)//
                    dispatch(setUserProfile(res.data.user))

                    
                }
                
            } catch (error) {
                console.log(error)
                
            }
        }
        fetchUserProfie ();
    },[userId]);

};
export default useGetUserProfile;
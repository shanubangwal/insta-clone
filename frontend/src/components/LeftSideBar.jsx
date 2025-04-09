import { CircleArrowDown, CircleArrowUp, Heart, Home, LogOut, MessageCircle, PlusSquare, Search, TrendingUp } from 'lucide-react'
import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { toast } from 'sonner'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
// import store from '@/redux/store'
import { setAuthUser } from '@/redux/authSlice'
import CreatePost from './CreatePost'
import { setSelectedPost } from '@/redux/postSlice'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { Button } from './ui/button'


export default function LeftSideBar() {

    const navigate = useNavigate();

    const {user} = useSelector(store=>store.auth);
    const {likeNotification} = useSelector(store=>store.realTimeNotification);
    const dispatch = useDispatch();
    const [open,setOpen]=useState(false);

    const logoutHandler = async () => {
        try {

            const res = await axios.get('https://connect-to.onrender.com/api/v1/user/logout', {
                withCredentials: true,
            });
            if(res.data.success){
                dispatch(setAuthUser(null))
                dispatch(setSelectedPost(null))
                dispatch(setSelectedPost())
                navigate('/login');
                toast.success(res.data.message)
            }
            if(res.data.success){
                toast.success(res.data.message);
            }
            

        } catch (error) {
            toast.error(error.response.data.message)
            
        }
    }


    const sidebarHandler = (texttype) => {
        if (texttype === 'Logout') {
          logoutHandler();
        } else if (texttype === 'Create') {
          setOpen(true);
        } else if (texttype === 'Profile') {
          navigate(`/profile/${user?._id}`);
        } else if (texttype === 'Home') {
          navigate("/");
        } else if (texttype === 'Messages') {
          navigate("/chat");
        }
      }

    const sidebarItems = [
        {icon:<Home/>, text:'Home'},
        {icon:<Search/>, text:'Search'},
        {icon:<TrendingUp/>, text:'Explore'},
        {icon:<MessageCircle/>, text:'Messages'},
        {icon:<Heart/>, text:'Notifications'},
        {icon:<PlusSquare/>, text:'Create'},
        {
            icon:(
            <Avatar className='w-8 h-8'>
                <AvatarImage src={user?.profilePicture} alt="Profile Picture" />
                <AvatarFallback>CN</AvatarFallback>
            </Avatar>
        ),
         text:'Profile'},
        {icon:<LogOut className=''/>, text:'Logout'},
    ]

  return (
    <>
    <div className=' fixed top-0 left-0 px-4 border-r-3 border-grey-300 w-[16%] h-screen ' >
        <div className='flex flex-col '>
            <h1 className='my-8 pl-3 font-bold text-xl flex flex-row justify-center items-center'>C<CircleArrowDown className='w-5 h-5'  /> NNECT T<CircleArrowUp  className='w-5 h-5' /> </h1>
            <div>
                    {
                        sidebarItems.map((item,index) => {
                            return (
                                <div onClick={() => sidebarHandler(item.text)} key={index} className='flex items-center gap-3 relative hover:bg-gray-300 cursor-pointer rounded-lg p-3 my-3'>
                                    {item.icon}
                                    <span>{item.text}</span>

                                    {
                                      item.text === 'Notifications' && likeNotification.length > 0 &&(
                                        <Popover>
                                          <PopoverTrigger asChild> 
                                            <div>
                                              <Button size='icon' className='rounded-full h-5 w-5 absolute bottom-6 left-6 bg-red-600 '>{likeNotification.length}</Button>

                                            </div>
                                          </PopoverTrigger>
                                          <PopoverContent>
                                            <div>
                                              {
                                                likeNotification.length === 0 ? (<p>No New Notifications</p>):(
                                                  likeNotification.map((notification)=>{
                                                    return (
                                                      <div key={notification.userId} className='flex gap-3 m-3 bg-gray-300 rounded-4xl items-center'>
                                                        <Avatar>
                                                          <AvatarImage src={notification.userDetails?.profilePicture} />
                                                          <AvatarFallback>CN</AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                        <p className='text-sm '> <span className='font-bold'>{notification.userDetails?.username} Liked Post</span></p>
                                                        
                                                        </div>
                                                      
                                                      </div>
                                                    )
                                                  })
                                                )
                                              }
                                            </div>
                                          </PopoverContent>
                                        </Popover>
                                      )
                                    }
                                    
                                </div>
                            )
                        })
                    }
            </div>
        </div>

        <CreatePost open={open} setOpen={setOpen}/>

    </div>

    </>
  )
}

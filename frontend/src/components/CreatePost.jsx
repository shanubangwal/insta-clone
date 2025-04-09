import React, { useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { readFileAsDataURL } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "@/redux/postSlice";


export default function CreatePost({ open, setOpen }) {
  const imageRef = useRef();
  const [file, setFile] = useState("");
  const [caption, setCaption] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [loading , setLoading] = useState(false);
  const {user} = useSelector(store=>store.auth)
  const {posts} = useSelector(store=>store.post);
  const dispatch = useDispatch();

  const fileChangehandler = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      const dataUrl = await readFileAsDataURL(file);
      setImagePreview(dataUrl);
    }
  };

  const createPostHandler = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("caption",caption);
    if(imagePreview)formData.append("image",file);
    try {
      setLoading(true);
      const res = await axios.post('https://connect-to.onrender.com/api/v1/post/addpost',formData,{
        headers:{
          'Content-Type':'multipart/form-data'
        },
        withCredentials:true
      });
      if(res.data.success){
        dispatch(setPosts([res.data.post,...posts]));
        toast.success(res.data.message)
        setOpen(false)
      }
      
    } catch (error) {
      toast.error(error.response.data.message);
      
    } finally{
      setLoading(false)
    }
    
    

    } 
    
    

    

  

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          onInteractOutside={() => {
            setOpen(false);
          }}
          className="pt-10"
        >
          <DialogHeader className="text-center font-bold">
            Create New Post
          </DialogHeader>
          <div className="flex gap-3 items-center">
            <Avatar>
              <AvatarImage src={user?.profilePicture} alt="" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="font-semibold text-center">{user?.username}</h1>
              <span className="text-gray-600 text-sm">{user?.bio}</span>
            </div>
          </div>
          <Textarea
            value={caption}
            onChange={(e)=> setCaption(e.target.value)}
            className=" focus-visible:ring-transparent border-none"
            placeholder="Add caption Here"
          />
          {
            imagePreview && (
              <div className="w-full max-w-[80%] h-64 m-auto items-center justify-center">
                <img src={imagePreview} alt='post' className="w-[250px] h-[250px] m-auto"/>
              </div>
            )
          }
          <input
            ref={imageRef}
            type="file"
            className="hidden"
            onChange={fileChangehandler}
          />
          
          <Button
            className="w-fit mx-auto bg-blue-700 "
            onClick={() => imageRef.current.click()}
          >
            Select Your Image
          </Button>
          {
            imagePreview && (
              loading?(
                <Button>
                  <Loader2 className="mr-2 h-4 animate-spin"/>
                  Please Wait
                </Button>
              ):(
                <Button onClick={createPostHandler} type='submit'>Post</Button>
              )
            )
            
          }
        

        </DialogContent>
      </Dialog>
    </>
  );
};


import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
} from "./ui/select";
import { SelectValue } from "@radix-ui/react-select";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { setAuthUser } from "@/redux/authSlice";

export default function EditProfile() {
  const imageRef = useRef();
  const { user } = useSelector((store) => store.auth);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState({
    profilePhoto: user?.profilePicture,
    bio: user?.bio || "Bio here..",
    gender: user?.gender || "",  // ensure it's not "undefined"
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const fileChangeHandler = (e) => {
    const file = e.target.files?.[0];
    if (file) setInput({ ...input, profilePhoto: file });
  };

  const selectChangeHandler = (value) => {
    setInput({ ...input, gender: value });
  };

  const editProfileHandler = async () => {
    // console.log(input)//
    const formData = new FormData();
    formData.append("bio",input.bio)
    formData.append("gender",input.gender)
    if(input.profilePhoto){
        formData.append("profilePhoto",input.profilePhoto);
    }


    try {
      setLoading(true);
      const res = await axios.post("https://connect-to.onrender.com/api/v1/user/profile/edit",formData,{
        headers:{
            "Content-Type":'multipart/form-data',
        },
        withCredentials:true
      });
      if(res.data.success){
        const updatedUserData = {
            ...user,
            bio:res.data.user?.bio,
            profilePicture:res.data.user?.profilePicture,
            gender:res.data.user?.gender
        };
        dispatch(setAuthUser(updatedUserData));
        navigate(`/profile/${user?._id}`);

        toast.error(res.data.message);

      }


    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Something went wrong.");
    } finally{
        setLoading(false);
    }
  };

  return (
    <>
      <div className="flex w-3xl justify-center bg-[#ffffff] mt-5  mx-auto rounded-t-2xl mb-2 p-10 ">
        <section className="w-full">
          <h1 className="font-bold text-xl text-center ">Edit Profile</h1>
          <div>
            <div>
              <div className="bg-gray-300 flex flex-row items-center gap-2 mt-5  p-4  rounded-2xl h-fit  w-full justify-between ">
                <div className="flex flex-row items-center gap-2   ">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src={user.profilePicture} />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>

                  <div className="flex flex-col items-center">
                    <h2 className="font-semibold text-lg">@{user.username}</h2>
                    <span className="text-gray-700 text-lg">
                      {user.bio || "Bio Here..."}
                    </span>
                  </div>
                </div>
                <input type="file" ref={imageRef} className="hidden" onChange={fileChangeHandler}  />
                <Button onClick={() => imageRef?.current.click()}>
                  Change Profile Picture
                </Button>
              </div>
              <div>
                <h1 className="text-lg font-bold mt-3 ">Bio </h1>
                <Textarea
                value={input.bio} onChange={(e)=> setInput({...input,bio:e.target.value})}
                  className="focus-visible:ring-transparent"
                  name="bio"
                />
              </div>
              <div className="w-full flex flex-row  items-center my-3 gap-3 ">
                <div className="w-full flex flex-row  items-center my-3 gap-3 ">
                  <h1 className="text-lg font-bold mt-3 ">Gender</h1>
                  <Select defaultValue={input.gender} onValueChange={selectChangeHandler} >
                    <SelectTrigger className="w-fit">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {/* <SelectItem value="" disabled selected>Select Gender</SelectItem> */}
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Others</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                {loading ? (
                  <Button>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please
                    Wait
                  </Button>
                ) : (
                  <Button onClick={editProfileHandler} >Update</Button>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import axios from "axios";

export default function SuggestedUsers() {
  const { user } = useSelector((store) => store.auth);
  
  const { suggestedUsers } = useSelector((store) => store.auth);
  const [userProfile, setUserProfile] = useState(null);
  
  useEffect(() => {
    const fetchUserProfile = async () => {
      const res = await axios.get(`/api/v1/user/profile/${userProfile?.id}`);
      setUserProfile(res.data.user); // This object should include `posts`
    };

    fetchUserProfile();
  }, [userProfile?.id]);
  return (
    <>
      <div className=" w-full h-full bg-white mt-2 rounded-2xl p-3 flex flex-col pb-2 ">
        <div className="flex w-full justify-between">
          {" "}
          <h1 className="font-semibold ">Suggested Users</h1>
          <span className="text-sm text-gray-600">See All</span>
        </div>
        <div className=" w-full h-[450px] overflow-y-auto hide-scrollbar">
          { (suggestedUsers || []).map((user) => {
            return (
              <div key={user._id} className="">
                <div>
                  <div className="bg-gray-300 flex flex-row items-center mt-5 rounded-2xl p-2 h-fit justify-between">
                    <div className="flex flex-row gap-2 w-full ">
                      <Link to={`/profile/${user?._id}`}>
                        <Avatar className="w-10 h-10">
                          <AvatarImage
                            src={user.profilePicture}
                            className="bg-black "
                          />
                          <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                      </Link>
                      <div className="flex flex-col ">
                        <Link
                          className="font-semibold text-sm "
                          to={`/profile/${user?._id}`}
                        >
                          @{user.username}
                        </Link>
                        <span className="text-gray-700 text-sm">
                          {(user.bio?.split(" ").slice(0, 10).join(" ") ||
                            "Bio Here...") +
                            (user.bio?.split(" ").length > 10 ? "..." : "")}
                        </span>
                      </div>
                    </div>
                    <span className="border p-1 rounded text-1xl text-[#3BADF8] font-bold hover:bg-[#3BADF8] hover:text-white  border-white cursor-pointer ">
                      Follow
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

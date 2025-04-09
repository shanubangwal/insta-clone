import { React, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import SuggestedUsers from "./SuggestedUsers";

export default function Rightsidebar() {
  const { user } = useSelector((store) => store.auth);

  return (
    <>
      <div className="flex flex-col bg-gray-300 top-0 right-0 pr-2 pl-2 sticky w-[25%] h-screen pb-2">
        <div>
          <div className="bg-white flex flex-row items-center gap-2 mt-5 rounded-2xl p-5 h-fit">
            <Link to={`/profile/${user?._id}`}>
              <Avatar className="w-15 h-15">
                <AvatarImage src={user?.profilePicture} />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </Link>
            <div className="flex flex-col justify-start">
              <Link className="font-semibold " to={`/profile/${user?._id}`}>
                @{user?.username}
              </Link>
              <span className="text-gray-700 text-[13px]">
                {user?.bio
                  ? user.bio.split(" ").slice(0, 10).join(" ") +
                    (user.bio.split(" ").length > 10 ? "..." : "")
                  : "Bio Here..."}
              </span>

            </div>
          </div>
        </div>

        <SuggestedUsers />
      </div>
    </>
  );
}

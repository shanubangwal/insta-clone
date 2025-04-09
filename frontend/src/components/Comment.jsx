import React from "react";
// import { useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Link } from "react-router-dom";
import { FaHeart } from "react-icons/fa";

export default function Comment({ comment }) {
//   const { selectedPost } = useSelector((store) => store.post);//

  return (
    <>
      <div className="my-2 bg-gray-200 p-2 rounded-2xl">
        <div className="flex flex-row items-center mb-2">
        <Avatar className="">
          <AvatarImage src={comment.author.profilePicture}  />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
          <Link className="font-semibold text-sm " to="">@
            {comment?.author?.username}
          </Link>
        </div>
        <div>
            {comment.text}
        </div>
          
      </div>
    </>
  );
}

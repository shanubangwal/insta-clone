import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { useSelector } from "react-redux";
import useGetAllMessage from "@/hooks/useGetAllMessage";
import useGetRTM from "@/hooks/useGetRTM";

export default function Messages({ selectedUser }) {
  useGetRTM();
  useGetAllMessage();
  const {messages} = useSelector(store=>store.chat)
  const {user} =useSelector(store => store.auth)
  return (
    <>
      <div className=" bg-white flex-1 w-[100%] overflow-y-auto h-[78.5vh] ">
        <div className="flex justify-center">
          <div className="flex flex-col w-[300px] justify-center items-center">
            <Avatar className="w-30 h-30">
              <AvatarImage src={selectedUser?.profilePicture} />
              <AvatarFallback>Cn</AvatarFallback>
            </Avatar>
            <div className="text-center">
              <h1 className="text-lg font-semibold text-center">
                {selectedUser?.username}
              </h1>
              <h1 className="text-lg text-sm text-center">
                {selectedUser?.bio}
              </h1>
              <Link to={`/profile/${selectedUser?._id}`}>
                <Button className="text-semibold cursor-pointer font-semibold text-center text-white">
                  View Profile{" "}
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <div>
          {
          messages && messages.map((msg) => {
            const isSender = msg.sender === user?._id || msg.senderId === user?._id;

            return (
              <div className={`flex ${isSender ? 'justify-end' : 'justify-start'}`} key={msg.id}>
                <div className={` animate-bounce min-w-[40px] min-h-[40px] max-w-[500px] bg-[#0000005d] flex flex-row gap-3 p-3 rounded-2xl m-2 ${isSender ? 'bg-blue-900' : 'bg-black'} text-white `} style={{ animationDuration: "10s"}} >
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={isSender ? user?.profilePicture : selectedUser?.profilePicture} />
                    <AvatarFallback>Cn</AvatarFallback>
                  </Avatar>
                  <div className={`max-w-[420px] wrap-break-word `}>
                  {msg.message}
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

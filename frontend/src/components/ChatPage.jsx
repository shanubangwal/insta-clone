import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { setSelectedUser } from "@/redux/authSlice";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { MessageCircle, MessageCircleCode, Section } from "lucide-react";
import Messages from "./Messages";
import axios from "axios";
import { setMessages } from "@/redux/chatSlice";

export default function ChatPage() {
  const [textMessage, setTextMessage] = useState("");
  const { user, suggestedUsers, selectedUser } = useSelector(
    (store) => store.auth
  );
  const { onlineUsers, messages } = useSelector((store) => store.chat);

  const isOnline = onlineUsers.includes(selectedUser?._id);
  const dispatch = useDispatch();

  const sendMessageHandler = async (receiverId) => {
    try {
      const res = await axios.post(
        `http://localhost:8000/api/v1/message/send/${receiverId}`,
        { textMessage },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        dispatch(setMessages([...messages, res.data.newMessage]));
        setTextMessage("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    return () => {
      dispatch(setSelectedUser(null));
    };
  }, []);

  return (
    <>
      <div className="flex flex-row ml-[16%] w-[84%] h-screen ">
        <section className="ml-2 w-[24%] mr-2">
          <div className="ml-2 mt-5">
            <h1 className="font-bold text-lg ">{user?.username}</h1>
            <Badge className="font-bold text-sm ">
              {" "}
              welcome back @{user?.username}
            </Badge>
          </div>
          <div className="overflow-y-auto h-[85vh] mt-5  flex-1 p-2 flex flex-col gap-3">
            {suggestedUsers.map((suggestedUser) => {
              const isOnline = onlineUsers.includes(suggestedUser?._id);
              return (
                <div
                
                  className=" flex gap-2 bg-[#0000001b] p-2 rounded-2xl"
                  onClick={() => dispatch(setSelectedUser(suggestedUser))}
                >
                  <Avatar className="w-9 h-9">
                    <AvatarImage src={suggestedUser?.profilePicture} />
                    <AvatarFallback>Cn</AvatarFallback>
                  </Avatar>
                  <div className="flex  flex-col justify-between">
                    <h1 className="text-[1.23vw] font-semibold">
                      @{suggestedUser?.username}
                    </h1>
                    <h1
                      className={`text-sm  ${
                        isOnline ? "text-green-500" : "text-red-600"
                      }`}
                    >
                      {isOnline ? "online" : "offine"}
                    </h1>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="bg-black flex-1 h-[100%]">
          {selectedUser ? (
            <section>
              <div>
                <div className=" flex gap-2 bg-[#0000001b] p-2 ">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={selectedUser?.profilePicture} />
                    <AvatarFallback>Cn</AvatarFallback>
                  </Avatar>
                  <div>
                    <h1 className="text-[1.23vw]  text-white font-semibold">
                      @{selectedUser?.username}
                    </h1>
                    <h1
                      className={`text-sm  ${
                        isOnline ? "text-green-500" : "text-red-600"
                      }`}
                    >
                      {isOnline ? "online" : "offine"}
                    </h1>
                  </div>
                </div>

                <Messages selectedUser={selectedUser} />

                <div className=" fixed flex flex-row items-center justify-between border-t bg-black border-t-gray-300 bottom-0 p-4 gap-2 w-[-webkit-fill-available]">
                  <input
                    value={textMessage}
                    onChange={(e) => setTextMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault(); // optional, stops form submission or adding newline
                        sendMessageHandler(selectedUser?._id);
                      }
                    }}
                    type="text"
                    className="bg-white rounded-sm w-full h-10 focus-visible:ring-transparent pl-2"
                    placeholder={`hello`}
                  />
                  <Button onClick={() => sendMessageHandler(selectedUser?._id)}>
                    Send
                  </Button>
                </div>
              </div>
            </section>
          ) : (
            <div className=" text-white flex flex-col items-center text-center justify-center h-full w-full">
              <MessageCircleCode className="w-40 h-40 my-4 " />
              <h1 className="font-bold text-xl">Connect To</h1>
              <p>
                Somone Is always waiting for you
                <br /> just message
              </p>
            </div>
          )}
        </section>
      </div>
    </>
  );
}

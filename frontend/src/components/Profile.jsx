import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import useGetUserProfile from "@/hooks/useGetUserProfile";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Heart, MessageCircle } from "lucide-react";
import CommentDialog from "./CommentDialog";
import { IoCodeWorkingSharp } from "react-icons/io5";

export default function Profile() {
  const params = useParams();
  const userId = params.id;
  useGetUserProfile(userId);
  const { userProfile, user } = useSelector((store) => store.auth);
  const { posts } = useSelector((store) => store.post);
  const [activeTab, setActiveTab] = useState("posts");
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const totalUsersPosts = () => {
    if (!userProfile || !posts) return 0;

    const userPosts = posts.filter(
      (post) => post?.author?._id === userProfile._id
    );
    return userPosts.length;
  };

  // console.log(userProfile,userId)//

  const isLoggedInUserProfile = user?._id === userProfile?._id;
  const isFollowing = true;

  const displayedPost =
    activeTab === "posts"
      ? posts?.filter((post) => post?.author?._id === userProfile?._id)
      : activeTab === "saved"
      ? userProfile?.bookmarks
      : [];

  return (
    <div className="flex w-3xl justify-center bg-[#00000030] mt-5  mx-auto rounded-t-2xl mb-2">
      <div className="flex flex-col gap-10 p-8 w-full ">
        <div className="flex flex-row  w-full justify-between">
          <section className="flex items-senter justify-center w-[30%]">
            <Avatar className="w-40 h-40 border-1 border-black">
              <AvatarImage
                src={userProfile?.profilePicture}
                alt="profilePhoto"
              />
              <AvatarFallback>Cn</AvatarFallback>
            </Avatar>
          </section>

          <section className="w-[69%]">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 w-full justify-between">
                <span className="font-semibold text-white">
                  {userProfile?.username}
                </span>
                {isLoggedInUserProfile ? (
                  <div className="flex gap-3">
                    <Link to="/account/edit">
                      <Button
                        variant="secondary"
                        className="hover:bg-gray-300 h-8 "
                      >
                        Edit Profile
                      </Button>
                    </Link>
                    <Button
                      variant="secondary"
                      className="hover:bg-gray-300 h-8 "
                    >
                      View archive
                    </Button>
                    <Button
                      variant="secondary"
                      className="hover:bg-gray-300 h-8 "
                    >
                      Ad tools
                    </Button>
                  </div>
                ) : isFollowing ? (
                  <div className="flex gap-3">
                    <Button
                      variant="ghost"
                      className="bg-white  h-8 text-red-600"
                    >
                      Unfollow
                    </Button>
                    <Button
                      variant="secondary"
                      className="hover:bg-gray-300 h-8  "
                    >
                      Message
                    </Button>
                  </div>
                ) : (
                  <div className="flex gap-3">
                    <Button
                      variant="secondary"
                      className="hover:bg-gray-300 h-8 "
                    >
                      Follow
                    </Button>
                  </div>
                )}
              </div>

              <div className="flex flex-row w-full justify-around text-white h-[40px] items-center ">
                {["male", "female", "other"].includes(userProfile?.gender) && (
                  <Badge
                    className={`w-20 text-lg text-white
                    ${userProfile.gender === "male" ? "bg-blue-600" : ""}
                    ${userProfile.gender === "female" ? "bg-pink-500" : ""}
                    ${
                      userProfile.gender === "other"
                        ? "bg-gradient-to-r from-pink-500 via-yellow-400 to-purple-500 text-black"
                        : ""
                    }
                  `}
                    
                  >
                    {userProfile.gender}
                  </Badge>
                )}
                <p className="font-semibold">
                  {totalUsersPosts()} <span>Posts</span>
                </p>
                <p className="font-semibold">
                  {userProfile?.followers.length} <span>Followers</span>{" "}
                </p>
                <p className="font-semibold">
                  {userProfile?.following.length} <span>Following</span>{" "}
                </p>
              </div>

              <div className="flex flex-col text-white">
                <span className="text-sm ">
                  <Badge>@{userProfile?.username} </Badge> here...
                </span>
                <span className="font-semibold">
                  {userProfile?.bio || "Bio here"}{" "}
                </span>
              </div>
            </div>
          </section>
        </div>
        <div className="h-auto min-h-[300px] bg-[#ffffff] rounded-t-2xl p-2">
          <div className=" sticky top-0 rounded-t-2xl flex flex-row justify-center gap-10 ">
            <span
              className={`  text-lg pt-2 pb-1 cursor-pointer ${
                activeTab === "posts" ? "font-bold" : ""
              }`}
              onClick={() => handleTabChange("posts")}
            >
              Posts
            </span>
            <span
              className={`  text-lg pt-2 pb-1 cursor-pointer ${
                activeTab === "saved" ? "font-bold" : ""
              }`}
              onClick={() => handleTabChange("saved")}
            >
              Saved
            </span>
            <span
              className={`  text-lg pt-2 pb-1 cursor-pointer ${
                activeTab === "reels" ? "font-bold" : ""
              }`}
              onClick={() => handleTabChange("reels")}
            >
              Reels
            </span>
            <span
              className={`  text-lg pt-2 pb-1 cursor-pointer ${
                activeTab === "tagged" ? "font-bold" : ""
              }`}
              onClick={() => handleTabChange("tagged")}
            >
              Tagged
            </span>
          </div>

          <div className=" w-full h-auto min-h-[300px] bg-[#101010ef] ">
            <div className="grid grid-cols-3 gap-3 p-2">
              {displayedPost?.map((post) => {
                return (
                  <div
                    key={post?._id}
                    className="relative group cursor-pointer "
                  >
                    <img
                      src={post.image}
                      alt="postimage"
                      className="rounded-sm pt-2 pb-2 w-full aspect-square object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-[#ffffff20] bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="flex items-center text-black space-x-4">
                        <button className="flex items-center gap-2 hover:text-gray-100">
                          <Heart />
                          <span>{post?.likes.length}</span>
                        </button>
                        <button className="flex items-center gap-2 hover:text-gray-100">
                          <MessageCircle />
                          <span>{post?.comments.length}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {(activeTab === "reels" || activeTab === "tagged") && (
              <div className="flex flex-col items-center justify-center h-64 text-center text-gray-600">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/189/189792.png"
                  alt="Maintenance"
                  className="w-20 h-20 mb-4 animate-bounce animate-spin"
                  style={{ animationDuration: "10s" }}
                />

                <h2 className="text-xl font-semibold">Work in Progress</h2>
                <p className="text-sm text-gray-500">I'm working on it 🛠️</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

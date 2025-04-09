import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Link } from "react-router-dom";
import { MoreHorizontal, MoreVertical } from "lucide-react";
import { Button } from "./ui/button";
import { useDispatch, useSelector } from "react-redux";
import { FaHeart } from "react-icons/fa";
import Comment from "./Comment";
import axios from "axios";
import { toast } from "sonner";
import { setPosts } from "@/redux/postSlice";

export default function CommentDialog({ open, setOpen }) {
  const [text, setText] = useState("");
  const { selectedPost, posts } = useSelector((store) => store.post);
  const dispatch = useDispatch();
  const [comment, setComment] = useState([]);

  useEffect(() => {
    if (selectedPost) {
      setComment(selectedPost.comments);
    }
  }, [selectedPost]);

  const changeEventhandler = (e) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setText(inputText);
    } else {
      setText("");
    }
  };

  const sendMessageHandler = async () => {
    try {
      const res = await axios.post(
        `https://connect-to.onrender.com/api/v1/post/${selectedPost?._id}/comment`,
        { text },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        const UpdatedcommentData = [...comment, res.data.comment];
        setComment(UpdatedcommentData);

        const updatedPostData = posts.map((p) =>
          p._id === selectedPost._id
            ? { ...p, comments: UpdatedcommentData }
            : p
        );

        dispatch(setPosts(updatedPostData));

        toast.success(res.data.message);

        setText("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          onInteractOutside={() => {
            setOpen(false);
          }}
          className="pt2 flex min-w-[800px]"
        >
          <div className="flex flex-1 ">
            <div className="w-1/2  ">
              <img
                src={selectedPost?.image}
                alt="post_img"
                className="w-[100%] h-[470px] object-cover rounded-lg  "
              />

              <div className="w-full flex flex-col justify-between  ">
                <div className="flex items-center justify-between p-1   ">
                  <div className="flex gap-3 items-center">
                    <Link>
                      <Avatar className="mt-2">
                        <AvatarImage
                          src={selectedPost?.author?.profilePicture}
                        />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                    </Link>
                    <div className="flex flex-col justify-around ">
                      <Link className="font-semibold ">
                        {selectedPost?.author?.username}
                      </Link>
                      <span className="flex flex-red items-center font-semibold w-full ">
                        <FaHeart className="text-red-600" />
                        {selectedPost?.likes?.length || 0} likes
                      </span>
                    </div>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <MoreVertical className="cursor-pointer" />
                    </DialogTrigger>
                    <DialogContent>
                      <div className="cursor-pointer w-full text-red-600 font-bold">
                        Unfollow
                      </div>
                      <div>Add to favourite</div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>

            <div className="flex-1  ml-3   ">
              <DialogTitle className="top-5 z-2 w-full bg-white ">
                Comments here
              </DialogTitle>
              <div className="h-[450px] overflow-y-auto">
                <div className="flex-1 ml-3 ">
                  {comment?.map((comment) => (
                    <Comment key={comment._id} comment={comment} />
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2 bg-white w-full pt-5">
                <input
                  type="text"
                  placeholder="Add a comment"
                  value={text}
                  onChange={changeEventhandler}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && text.trim()) {
                      e.preventDefault();
                      sendMessageHandler(); // <-- your existing function
                    }
                  }}
                  className="bg-gray-300 outline-none border-gray-600 p-2 rounded-sm w-full"
                />

                <Button
                  variant="outline"
                  disabled={!text.trim}
                  onClick={sendMessageHandler}
                >
                  Send
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

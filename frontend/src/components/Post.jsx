import { React, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Dialog, DialogTrigger, DialogContent } from "./ui/dialog";
import { Bookmark, MessageCircle, MoreHorizontal, Send } from "lucide-react";
import { Button } from "./ui/button";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import CommentDialog from "./CommentDialog";
import { useDispatch, useSelector } from "react-redux";
import { toast, Toaster } from "sonner";
import axios from "axios";
import { setPosts, setSelectedPost } from "@/redux/postSlice";
import { Badge } from "./ui/badge";
import { Link } from "react-router-dom";

export default function Post({ post }) {
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const { user } = useSelector((store) => store.auth);
  // const { posts } = useSelector(store => store.post);//
  const posts = useSelector((store) => store.post.posts);

  const [liked, setLiked] = useState(post.likes.includes(user?._id) || false);
  const [postLike, setPostLike] = useState(post.likes.length);
  const [comment, setComment] = useState(post.comments);

  const dispatch = useDispatch();

  const changeEventhandler = (e) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setText(inputText);
    } else {
      setText("");
    }
  };

  const likeOrDislikeHandler = async () => {
    try {
      const action = liked ? "dislike" : "like";

      const res = await axios.get(
        `http://localhost:8000/api/v1/post/${post._id}/${action}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        const updatedLikes = liked ? postLike - 1 : postLike + 1;
        setPostLike(updatedLikes);
        setLiked(!liked);

        // post ko update krna
        const updatedPostData = posts.map((p) =>
          p._id === post._id
            ? {
                ...p,
                likes: liked
                  ? p.likes.filter((id) => id !== user._id)
                  : [...p.likes, user._id],
              }
            : p
        );
        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // comments
  const commentHandler = async () => {
    try {
      const res = await axios.post(
        `http://localhost:8000/api/v1/post/${post._id}/comment`,
        { text },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      console.log(res.data);
      if (res.data.success) {
        const UpdatedcommentData = [...comment, res.data.comment];
        setComment(UpdatedcommentData);

        const updatedPostData = posts.map((p) =>
          p._id === post._id ? { ...p, comments: UpdatedcommentData } : p
        );

        dispatch(setPosts(updatedPostData));

        toast.success(res.data.message);

        setText("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const enterCommentHandler = (e) => {
    if (e.key === "Enter" && text.trim()) {
      commentHandler();
    }
  };

  const deletPostHandler = async () => {
    try {
      const res = await axios.delete(
        `http://localhost:8000/api/v1/post/delete/${post?._id}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        const updatedPostData = posts.filter(
          (postItem) => postItem?._id !== post?._id
        );
        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  const bookmarkhandler = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8000/api/v1/post/${post?._id}/bookmark`,
        { withCredentials: true }
      );
      if (res.data.success) {
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="my-8 w-full max-w-sm mx-auto bg-gray-200 p-5 rounded-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="w-8 h-8">
              <AvatarImage src={post.author.profilePicture} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="flex items-center gap-3">
              <Link to={`/profile/${post?.author?._id}`}>
                <h1 className="font-semibold">{post.author.username}</h1>
              </Link>
              {user?._id === post?.author?._id && <Badge>Author</Badge>}
            </div>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <MoreHorizontal className="cursor-pointer"></MoreHorizontal>
            </DialogTrigger>
            <DialogContent className="flex flex-col items-center text-sm text-center pt-15 ">
              {post?.author?._id !== user?._id && (
                <Button
                  variant="ghost"
                  className="cursor-pointer w-full font-bold text-red-600"
                >
                  Unfollow
                </Button>
              )}
              <Button variant="ghost" className="cursor-pointer w-full ">
                Add to Favourites
              </Button>
              {user && user?._id === post?.author._id && (
                <Button
                  variant="ghost"
                  className="cursor-pointer w-full "
                  onClick={deletPostHandler}
                >
                  Delete
                </Button>
              )}
            </DialogContent>
          </Dialog>
        </div>

        <img
          src={post.image}
          alt="post_img"
          className="rounded-sm my-3 w-full aspect-square object-cover"
        />

        <div className="flex items-center justify-between pl-2 pr-2">
          <div className="flex flex-row gap-4">
            {liked ? (
              <FaHeart
                size={"25px"}
                className="cursor-pointer text-red-600 hover:text-gray-400 hover:scale-130"
                onClick={likeOrDislikeHandler}
              />
            ) : (
              <FaRegHeart
                size={"25px"}
                className="cursor-pointer hover:text-gray-400 hover:scale-130"
                onClick={likeOrDislikeHandler}
              />
            )}
            <MessageCircle
              onClick={() => {
                dispatch(setSelectedPost(post));
                setOpen(true);
              }}
              className="cursor-pointer hover:text-gray-400 hover:scale-130"
              size={"25px"}
            />
            <Send
              className="cursor-pointer hover:text-gray-400 hover:scale-130"
              size={"25px"}
            />
          </div>
          <Bookmark
            onClick={bookmarkhandler}
            className="cursor-pointer hover:text-gray-400 hover:scale-130"
            size={"25px"}
          />
        </div>

        <span className="font-sm block">{postLike} Likes</span>
        <p>
          <span className="font-medium mr-2">{post.author.username}</span>
          {post.caption}
        </p>
        {comment.length > 0 && (
          <span
            onClick={() => {
              dispatch(setSelectedPost(post));
              setOpen(true);
            }}
            className="cursor-pointer "
          >
            View all {comment.length} Comments
          </span>
        )}

        <CommentDialog open={open} setOpen={setOpen} />
        <div className="flex items-center justify-between mt-2 mb-2">
          <input
            type="text"
            placeholder="Add a Comment"
            className="outline-none text-sm w-full"
            value={text}
            onChange={changeEventhandler}
            onKeyDown={enterCommentHandler}
          />
          {text && (
            <span
              className="text-blue-800 font-bold cursor-pointer "
              onClick={commentHandler}
            >
              Post
            </span>
          )}
        </div>
      </div>
    </>
  );
}

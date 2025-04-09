// src/services/userService.js
import axios from "axios";

export const followOrUnfollowUser = async (targetUserId) => {
  try {
    const res = await axios.post(
      `https://connect-to.onrender.com/api/v1/user/followorunfollow//${targetUserId}`,
      {},
      { withCredentials: true }
    );
    return res.data;
  } catch (error) {
    console.error("Follow/Unfollow Error:", error);
    throw error;
  }
};
// src/services/userService.js
import axios from "axios";

export const followOrUnfollowUser = async (targetUserId) => {
  try {
    const res = await axios.post(
      `http://localhost:8000/api/v1/user/followorunfollow//${targetUserId}`,
      {},
      { withCredentials: true }
    );
    return res.data;
  } catch (error) {
    console.error("Follow/Unfollow Error:", error);
    throw error;
  }
};
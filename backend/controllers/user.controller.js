import { User } from "../models/user.model.js";
// import User from "../models/user.model.js";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import { Post } from "../models/post.model.js";

export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(401).json({
                message: "Please fill all the fields",
                success: false,
            });
        }

        const existingUserName = await User.findOne({ username });
        if (existingUserName) {
            // username already exists
            return res.status(401).json({
                message: "try diffrent username",
                success: false,
            });
        }
        
        const user = await User.findOne({ email });
        if (user) {
            return res.status(401).json({
                message: "try diffrent email",
                success: false,
            });
        }


        const hashedPassword = await bcrypt.hash(password, 10);
        if (!hashedPassword) {
            return res.status(401).json({
                message: "something went wrong",
                success: false,
            });
        }
        await User.create({
            username,
            email,
            password: hashedPassword,
        });
        return res.status(201).json({
            message: "Account created successfully",
            success: true,
        });


    } catch (error) {
        console.log(error);


    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(401).json({
                message: "Please fill all the fields",
                success: false,
            });
        }
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                message: "incorrect email or password",
                success: false,
            });
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({
                message: "Invalid Password",
                success: false,
            });
        }
        
        
        const token = await jwt.sign({userID:user._id },process.env.SECRET_KEY, {expiresIn: "1d"});

        // populate each post id in array 
        const populatedPosts = await Promise.all(user.posts.map(async (postId) => {
            const post = await Post.findById(postId);
            if (post.author.equals(user._id)) {
                return post;
            }
            return null;


        }));
        user.posts = populatedPosts;

        user ={
            _id: user._id,
            username: user.username,
            email: user.email,
            profilePicture: user.profilePicture,
            bio: user.bio,
            followers: user.followers,
            following: user.following,
            posts: populatedPosts,

        }
        return res.cookie('token', token, {httpOnly: true,sameSite:'strict', maxAge: 1*24 * 60 * 60 * 1000}).json({
            message: `Login successfully ${user.username}`,
            success: true,
            user,
            // user: {
            //     _id: user._id,
            //     username: user.username,
            //     email: user.email,
            // },
        });



    } catch (error) {
        console.log(error);
    }
}


export const logout = async (req, res) => {
    try {
        res.clearCookie("token", '', { maxAge:0}).json({
            message: "Logout successfully",
            success: true,
        });
    } catch (error) {
        console.log(error);
    }
};

export const getProfile = async (req, res) => {
    try {
        const userId = req.params.id;
        let user = await User.findById(userId).populate({path:'posts', CreatedAt: -1}).populate('bookmarks');
        return res.status(200).json({
            user,
            success: true,
        });



    } catch (error) {
        console.log(error);
    }
}

export const editProfile = async (req, res) => {
    try {
        const userId = req.id;
        const {bio,gender} = req.body;
        const profilePicture = req.file;
        
        let cloudResponse;
        

        if (profilePicture) {
            const fileUri = getDataUri(profilePicture);
            cloudResponse = await cloudinary.uploader.upload(fileUri);

        }
        const user = await User.findById(userId).select("-password");
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false,
            });
        }
        if (bio) user.bio = bio;
        if (gender) user.gender = gender;
        if (profilePicture) user.profilePicture = cloudResponse.secure_url;

        await user.save();
        return res.status(200).json({
            message: "Profile updated successfully",
            success: true,
            user,
        });

    } catch (error) {
        console.log(error);
    }
}


export const getSuggestedUser = async (req, res) => {
    try {
        const suggestedUsers = await User.find({ _id: { $ne: req.id } }).select("-password");

        if (!suggestedUsers) {
            return res.status(404).json({
                message: "No suggested users found",
                success: false,
            });
        }

        return res.status(200).json({
            message: "Suggested users",
            success: true,
            users: suggestedUsers,
        });


    } catch (error) {
        console.log(error);
    }
}

export const followorUnfollowUser = async (req, res) => {
    try {

        const followKrneWala = req.id;
        const jiskoFollowKrunga = req.params.id;

        if (followKrneWala === jiskoFollowKrunga) {
            return res.status(400).json({
                message: "You cannot follow/unfollow yourself",
                success: false,
            });
        }

        const user = await User.findById(followKrneWala);
        const targetUser = await User.findById(jiskoFollowKrunga);
        if (!user || !targetUser) {
            return res.status(404).json({
                message: "User not found",
                success: false,
            });
        }

        // now chck if user is already following the target user or not
        const idFollowing = user.following.includes(jiskoFollowKrunga);
        if (idFollowing) {
            // unfollow logic
            await Promise.all([
                User.updateOne({ _id: followKrneWala }, { $pull: { following: jiskoFollowKrunga } }),
                User.updateOne({ _id: jiskoFollowKrunga }, { $pull: { followers: followKrneWala } }),
            ]);
            return res.status(200).json({
                message: "Unfollowed successfully",
                success: true,
            });
        }
        else {

            await Promise.all([
                User.updateOne({ _id: followKrneWala }, { $push: { following: jiskoFollowKrunga } }),
                User.updateOne({ _id: jiskoFollowKrunga }, { $push: { followers: followKrneWala } }),
            ]);
            return res.status(200).json({
                message: "followed successfully" ,
                success: true,
            });
        }

        // const idFollower = targetUser.followers.includes(followKrneWala);


    } catch (error) {
        console.log(error);
    }
}



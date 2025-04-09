import sharp from "sharp";
import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";
import { Comment } from "../models/comment.model.js";
import cloudinary from "../utils/cloudinary.js";
import { getReceiverSocketId, io } from "../sockets/socket.js";
export const addNewPost = async (req, res) => {
    try {
        const { caption } = req.body;
        const image = req.file;

        const authorId = req.id;

        if (!image) {
            return res.status(401).json({
                message: "Image is required",
                success: false,
            });
        }

        // image upload 

        const optimizedImageBuffer = await sharp(image.buffer)
            .resize(800, 800, { fit: "inside", withoutEnlargement: true })
            .toFormat("jpeg", { quality: 80 })
            .toBuffer();

        //buffer to data uri
        const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString("base64")}`;

        const cloudRespose = await cloudinary.uploader.upload(fileUri);
        const post = await Post.create({
            caption,
            image: cloudRespose.secure_url,
            author: authorId,
        });

        const user = await User.findById(authorId);
        if (!user) {
            user.posts.push(post._id);
            await user.save();
        }

        await post.populate({ path: 'author', select: '-password' });
        return res.status(201).json({
            message: "Post created successfully",
            post,
            success: true,
        })





    } catch (error) {
        console.log(error);
    }
}

export const getAllPosts = async (req, res) => {
    try {

        const posts = await Post.find().sort({ createdAt: -1 })
            .populate({ path: 'author', select: 'username profilePicture' })
            .populate({
                path: 'comments',
                short: { createdAt: -1 },
                populate: {
                    path: 'author',
                    select: 'username profilePicture'
                }
            });

        return res.status(200).json({
            message: "Posts fetched successfully",
            posts,
            success: true,
        })

    } catch (error) {
        console.log(error);
    }
}


export const getUserPost = async (req, res) => {
    try {

        const authorId = req.id;
        const posts = await Post.find({ author: authorId }).sort({ createdAt: -1 }).populate({
            path: 'author',
            select: 'username profilePicture'
        }).populate({
            path: 'comments',
            short: { createdAt: -1 },
            populate: {
                path: 'author',
                select: 'username profilePicture'
            }
        });


        return res.status(200).json({
            message: "Posts fetched successfully",
            posts,
            success: true,
        })

    } catch (error) {
        console.log(error);
    }
}


export const likePost = async (req, res) => {
    try {
        const likeKrneWalaUserKiId = req.id;
        const postId = req.params.id;
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({
                message: "Post not found",
                success: false,
            })
        }

        // like logic
        await post.updateOne({ $addToSet: { likes: likeKrneWalaUserKiId } });
        await post.save();


        // impletment soket for notification real time

        const user = await User.findById(likeKrneWalaUserKiId).select('username profilePicture');

        // if users like itself post
        const postOwnerId = post?.author.toString();
        if (postOwnerId !== likeKrneWalaUserKiId) {
            //emit notification
            const notification = {
                type: 'like',
                userId: likeKrneWalaUserKiId,
                userDetails: user,
                postId,
                message: 'your Post is liked'
            }
            const postOwnerSocketId = getReceiverSocketId(postOwnerId);
            io.to(postOwnerSocketId).emit('notification', notification)
        }


        return res.status(200).json({
            message: "Post liked successfully",
            success: true,
        })
    } catch (error) {
        console.log(error);

    }
}


export const dislikePost = async (req, res) => {
    try {
        const likeKrneWalaUserKiId = req.id;
        const postId = req.params.id;
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({
                message: "Post not found",
                success: false,
            })
        }

        // like logic
        await post.updateOne({
            $pull: { likes: likeKrneWalaUserKiId }
        }); await post.save();


        // impletment soket for notification real time
        const user = await User.findById(likeKrneWalaUserKiId).select('username profilePicture');

        // if users like itself post
        const postOwnerId = post?.author.toString();
        if (postOwnerId !== likeKrneWalaUserKiId) {
            //emit notification
            const notification = {
                type: 'dislike',
                userId: likeKrneWalaUserKiId,
                userDetails: user,
                postId,
                message: 'your Post is disliked'
            }
            const postOwnerSocketId = getReceiverSocketId(postOwnerId);
            io.to(postOwnerSocketId).emit('notification', notification)
        }


        return res.status(200).json({
            message: "Post disliked successfully",
            success: true,
        })
    } catch (error) {
        console.log(error);

    }
}

export const addComment = async (req, res) => {
    try {
        const postId = req.params.id;
        const commentKrnewWalaUserKiId = req.id;

        const { text } = req.body;
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({
                message: "add something in comment",
                success: false,
            })

        }
        const comment = await Comment.create({
            text,
            post: postId,
            author: commentKrnewWalaUserKiId,

        })
        await comment.populate({
            path: 'author',
            select: 'username profilePicture',
        });

        post.comments.push(comment._id);
        post.save();

        return res.status(201).json({
            message: "Comment added successfully",
            comment,
            success: true,
        })
    } catch (error) {
        console.log(error);

    }
}

export const getCommentsOfPost = async (req, res) => {
    try {
        const postId = req.params.id;

        const comments = await Comment.find({ post: postId }).populate({
            path: 'author',
            select: 'username profilePicture',

        })
        if (!comments) {
            return res.status(404).json({
                message: "No comments found",
                success: false,
            })
        }

        return res.status(200).json({
            message: "Comments fetched successfully",
            comments,
            success: true,
        })

    } catch (error) {
        console.log(error);

    }
}


export const deletePost = async (req, res) => {
    try {

        const postId = req.params.id;
        const authorId = req.id;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({
                message: "Post not found",
                success: false,
            })
        }

        // check if the logged in user is the author of the post
        if (post.author.toString() !== authorId) {
            return res.status(401).json({
                message: "You are not authorized to delete this post",
                success: false,
            })
        }

        // delete the post
        await Post.findByIdAndDelete(postId);

        // remove the post from the user's posts array
        let user = await User.findById(authorId);
        user.posts = user.posts.filter(id => id.toString() !== postId);
        await user.save();

        // delete comments 
        await Comment.deleteMany({ post: postId });
        return res.status(201).json({
            message: "Post deleted successfully",
            success: true,
        })


    } catch (error) {
        console.log(error);

    }
}


// export const bookmarkPost = async (req, res) => {
//     try {

//         const postId = req.params.id;
//         const authorId = req.id;
//         const post = await Post.findById(postId);
//         if (!post) {
//             return res.status(404).json({
//                 message: "Post not found",
//                 success: false,
//             })
//         }
//         // check if the logged in user is the author of the post

//         // if (post.author.toString() === authorId) {
//         //     return res.status(401).json({
//         //         message: "You are not authorized to bookmark this post",
//         //         success: false,
//         //     })
//         // }

//         // bookmark logic
//         const user = await User.findById(authorId);
//         if (!user.bookmarks.includes(post._id)) {
//             //if bookmark is already present then remove it
//             await user.updateOne({
//                 $pull: {
//                     bookmarks: post._id,
//                 },
//             });
//             await user.save();
//             res.status(200).json({
//                 message: "Post unbookmarked successfully",
//                 success: true,
//                 type: 'unsaved'
//             })
//         } else {
//             // if bookmark is not present then add it
//             await user.updateOne({
//                 $addToSet: {
//                     bookmarks: post._id,
//                 },
//             });
//             await user.save();
//             res.status(200).json({
//                 message: "Post bookmarked successfully",
//                 success: true,
//                 type: 'saved'
//             })
//         }

//     } catch (error) {
//         console.log(error);

//     }
// }

export const bookmarkPost = async (req,res) => {
    try {
        const postId = req.params.id;
        const authorId = req.id;
        const post = await Post.findById(postId);
        if(!post) return res.status(404).json({message:'Post not found', success:false});
        
        const user = await User.findById(authorId);
        if(user.bookmarks.includes(post._id)){
            // already bookmarked -> remove from the bookmark
            await user.updateOne({$pull:{bookmarks:post._id}});
            await user.save();
            return res.status(200).json({type:'unsaved', message:'Post removed from bookmark', success:true});

        }else{
            // bookmark krna pdega
            await user.updateOne({$addToSet:{bookmarks:post._id}});
            await user.save();
            return res.status(200).json({type:'saved', message:'Post bookmarked', success:true});
        }

    } catch (error) {
        console.log(error);
    }
}



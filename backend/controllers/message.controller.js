import { Conversation } from "../models/conversation.model.js";
import { Message } from "../models/message.model.js";
import { getReceiverSocketId, io } from "../sockets/socket.js";
// for chating
export const sendMessage = async (req, res) => {
    try {
        const senderId = req.id;
        const receiverId = req.params.id;
        const { textMessage:message } = req.body;
        // console.log(message)//

        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] },
        });
        // establish the conversation if not started yet.
        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId],
            });
            // return res.status(201).json({
            //     message: "Conversation started",
            //     conversation,
            //     success: true,
            // });
        };

        // add message to the conversation
        const newMessage = await Message.create({
            sender:senderId,
            receiver:receiverId,
            message,

        });
        if (!newMessage) conversation.messages.push(newMessage._id);

        conversation.messages.push(newMessage._id);
        await Promise.all([conversation.save(), newMessage.save()]);

        // implimentsocket io here for real time chat
        const receiverSocektId = getReceiverSocketId(receiverId);
        if (receiverSocektId) {
            io.to(receiverSocektId).emit('newMessage', newMessage);
        }

        // .....



        return res.status(201).json({
            message: "Message sent successfully",
            success: true,
            newMessage,
        });


    } catch (error) {
        console.log(error);

    }
}

export const getMessages = async (req, res) => {
    try {
        const senderId = req.id;
        const receiverId = req.params.id;

        const conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] },
        }).populate('messages');
        if (!conversation) {
            return res.status(200).json({
                // message: "No conversation found",
                success: true,
                messages: [],
            });
        }

        return res.status(200).json({
            // message: "Conversation fetched successfully",
            success: true,
            messages: conversation?.messages,
        });

    } catch (error) {
        console.log(error);

    }
}
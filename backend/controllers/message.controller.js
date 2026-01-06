import { Message } from "../models/message.model.js";
import { getIO } from "../lib/socket.js";

// @desc    Send a message
// @route   POST /api/v1/messages
// @access  Private
export const sendMessage = async (req, res, next) => {
    try {
        const { receiver, text } = req.body;
        const sender = req.user.id;

        let message = await Message.create({
            sender,
            receiver,
            text
        });

        message = await message.populate('sender', 'name avatar');
        message = await message.populate('receiver', 'name avatar');

        const io = getIO();
        console.log(`Emitting newMessage to room: ${receiver}`);
        io.to(receiver).emit("newMessage", message);

        res.status(201).json({
            success: true,
            data: message
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get conversation with a user
// @route   GET /api/v1/messages/:userId
// @access  Private
export const getConversation = async (req, res, next) => {
    try {
        const otherUser = req.params.userId;
        const me = req.user.id;

        const messages = await Message.find({
            $or: [
                { sender: me, receiver: otherUser },
                { sender: otherUser, receiver: me }
            ]
        })
            .sort({ createdAt: 1 })
            .populate('sender', 'name avatar')
            .populate('receiver', 'name avatar');

        res.status(200).json({
            success: true,
            count: messages.length,
            messages
        });
    } catch (error) {
        next(error);
    }
};

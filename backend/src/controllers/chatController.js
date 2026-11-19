import * as chatService from "../services/chatService.js";
export async function sendMessage(req, res) {
    try {
        const userId = Number(req.user.id);
        const { content } = req.body;
        const message = await chatService.sendMessage(userId, content);
        res.status(201).json({
            message: message
        })
    } catch (error) {
        if (error.message.trim() === "Empty Message" || error.message.trim() === "Message Too Long") {
            return res.status(400).json({
                message: error.message
            })
        } else if (error.message.trim() === "Too Fast") {
            return res.status(429).json({
                message: error.message
            })
        }
        res.status(500).json({
            message: error.message
        })
    }
}
export async function syncChat(req, res) {
    try {
        const userId = Number(req.user.id);
        const after = Number(req.query.after) || 0;
        const chat = await chatService.syncChat(userId, after);
        res.status(200).json(chat)
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

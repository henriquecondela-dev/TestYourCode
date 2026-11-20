import * as adminService from "../services/adminService.js";
export async function broadcast(req, res) {
    try {
        const { subject, message, test } = req.body;
        const result = await adminService.broadcast(subject, message, test === true);
        res.status(200).json(result);
    } catch (error) {
        if (error.message.trim() === "Subject And Message Required" || error.message.trim() === "Too Many Users For One Day") {
            return res.status(400).json({
                message: error.message
            })
        }
        res.status(500).json({
            message: error.message
        })
    }
}
export async function sendToUser(req, res) {
    try {
        const { email, subject, message } = req.body;
        const result = await adminService.sendToUser(email, subject, message);
        res.status(200).json(result);
    } catch (error) {
        if (error.message.trim() === "Email, Subject And Message Required") {
            return res.status(400).json({
                message: error.message
            })
        } else if (error.message.trim() === "User Not Found") {
            return res.status(404).json({
                message: error.message
            })
        }
        res.status(500).json({
            message: error.message
        })
    }
}

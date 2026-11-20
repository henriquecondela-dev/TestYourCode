import "dotenv/config"
export default function adminMiddleware(req, res, next) {
    const adminKey = req.headers["x-admin-key"];
    if (!process.env.ADMIN_KEY || adminKey !== process.env.ADMIN_KEY) {
        return res.status(403).json({
            message: "Access denied"
        });
    }
    next();
}

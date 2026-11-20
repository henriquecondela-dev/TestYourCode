export default function validateUser(req, res, next) {
    const { email, password ,username} = req.body;
    if (!email || !password || !username) {
        return res.status(400).json({
            message: "Email, password and username are required"
        });
    }else if (password.length < 6) {
        return res.status(400).json({
            message: "Password must have at least 6 characters"
        });
    }
    const passwordPattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).{6,}$/;
    if (!passwordPattern.test(password)) {
        return res.status(400).json({
            message: "Password must have an uppercase letter, a lowercase letter and a number"
        });
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        return res.status(400).json({
            message: "Invalid email"
        });
    }
    next();
}

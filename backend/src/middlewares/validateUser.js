export default function validateUser(req, res, next) {
    
    const { email, password ,username} = req.body;
    if (!email || !password || !username) {
        return res.status(400).json({
            message: "Email, senha e nome de usuário são obrigatórios"
        });
    }else if (password.length < 6) {
        return res.status(400).json({
            message: "Senha deve ter pelo menos 6 caracteres"
        });
    }
    const passwordPattern = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[a-z]).{6,}$/;
    if (!passwordPattern.test(password)) {
        return res.status(400).json({
            message: "Senha deve conter pelo menos uma letra maiúscula, uma letra minúscula e um número"
        });
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        return res.status(400).json({
            message: "Email inválido"
        });
    }

    next();
}
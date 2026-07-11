import * as authService from "../services/authServices.js";
export async function login(req, res){
    try{
        const {email, password}=req.body;
        const token= await authService.login(email, password);
        res.status(200).json({
            message: "Login realizado com sucesso",
            token: token
        });
    }catch(error){
        res.status(401).json({
            message: error.message
        });
    }
}
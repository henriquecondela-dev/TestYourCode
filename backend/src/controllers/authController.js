import * as authService from "../services/authServices.js";
import Prisma from "@prisma/client";
export async function login(req, res){
    try{
        const {email, password}=req.body;
        const token= await authService.login(email, password);
        res.status(200).json({
            message: "Login realizado com sucesso",
            token:token.token,
            user:token.user
        });
    }catch(error){
         return res.status(401).json({
            message: error.message
        });
    }
}
export async function signup(req, res){
    try{
        const {email,password,username}=req.body;
       
        const user= await authService.signup(email,password,username);
        res.status(201).json({
            message: "Usuario criado com sucesso",
            user: {id:user.id, username:user.username, email:user.email},
        });
    }catch(error){
        if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
        ){
            return res.status(409).json({
                message: "Email ou username já está em uso."
            });
        };
        res.status(500).json({
            message: error.message
        });
    }
};
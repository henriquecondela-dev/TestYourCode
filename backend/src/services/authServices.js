import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import prisma from "../lib/prisma.js";
import "dotenv/config"
export async function login(email, password) {
    const user= await prisma.user.findUnique({
        where:{email}
    });
    if (!user){
        throw new Error("Erro: Email ou senha invalidos");
    }
    const isPasswordCorrect= await bcrypt.compare(password, user.password);
    if(!isPasswordCorrect){
        throw new Error("Erro: Email ou senha invalidos");
    }
    const token= jwt.sign({id:user.id, username:user.username}, process.env.JWT_SECRET,{expiresIn:"1h"});
    return {token:token, user:{id:user.id, username:user.username, email:user.email}};
}
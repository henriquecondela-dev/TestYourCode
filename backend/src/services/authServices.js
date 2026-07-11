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
    const correctPassword= await bcrypt.compare(password, user.password);
    if(!correctPassword){
        throw new Error("Erro: Email ou senha invalidos");
    }
    const token= jwt.sign({id:user.id, email:user.email}, process.env.JWT_SECRET,{expiresIn:"1h"});
    return token;
}
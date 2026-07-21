import prisma from "../lib/prisma.js";
import bcrypt from "bcrypt";

export async function getUsers() {
    const numberOfUsers = await prisma.user.count();
    if (numberOfUsers === 0) {
        throw new Error("Not user found");
    }
    const users = await prisma.user.findMany();
    return { users, numberOfUsers };
}

export async function me(user){
    if(!user){
        throw new Error("Profile not found")
    }
    const me=await prisma.user.findUnique({
        where:{id:Number(user.id)},include:{groups:true}
    })
    return me;
}

export async function deleteUser(id) {
    const user = await prisma.user.delete({
        where: { id: Number(id) }
    })
    if(!user){throw new Error("User Not Found");}
    return;
}

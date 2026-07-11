import prisma from "../lib/prisma.js";
import bcrypt from "bcrypt";
export async function getUsers() {
    const numberOfUsers = await prisma.user.count();
    if (numberOfUsers === 0) {
        throw new Error("Nenhum usuário encontrado");
    }
    const users = await prisma.user.findMany();
    users.forEach(user => { 
    });
    return { users, numberOfUsers };
}
export async function createUser(username, email, password) {
    const hashedpasword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
        data: {
            username,
            email,
            password: hashedpasword
        }
    });
    return user;
}
export async function getUserProfile(id) {
    const user = await prisma.user.findUnique({
        where: { id: Number(id) }
    })
    return user;
}
export async function deleteUser(id) {
    const user = await prisma.user.delete({
        where: { id: Number(id) }
    })
    return user;
}

import prisma from "../lib/prisma.js";
import bcrypt from "bcrypt";
import { removeGroups } from "./groupService.js";

const AVATARS_TOTAL = 14;
const AVATAR_COLORS = ["black", "green", "blue", "red", "orange", "purple"];

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

export async function saveAvatar(userId, avatar, avatarColor) {
    if (avatar) {
        const number = Number(avatar.replace("avatar", "").replace(".jpg", ""));
        if (!/^avatar\d+\.jpg$/.test(avatar) || number < 1 || number > AVATARS_TOTAL) {
            throw new Error("Invalid Avatar");
        }
    }
    if (avatarColor && !AVATAR_COLORS.includes(avatarColor)) {
        throw new Error("Invalid Color");
    }
    const user = await prisma.user.update({
        where: {
            id: userId
        }, data: {
            avatar: avatar || null,
            avatarColor: avatar ? null : avatarColor || null
        }
    })
    return { avatar: user.avatar, avatarColor: user.avatarColor };
}

export async function changePassword(userId, currentPassword, newPassword) {
    if (!currentPassword || !newPassword) throw new Error("Missing Fields");
    const user = await prisma.user.findUnique({
        where: {
            id: userId
        }
    })
    if (!user) throw new Error("User Not Found");
    const isPasswordCorrect = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordCorrect) throw new Error("Wrong Password");
    if (newPassword.length < 6 || !/[A-Z]/.test(newPassword) || !/[a-z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
        throw new Error("Weak Password");
    }
    const hashedpasword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
        where: {
            id: userId
        }, data: {
            password: hashedpasword
        }
    })
    return;
}

export async function deleteAccount(userId, password) {
    if (!password) throw new Error("Missing Fields");
    const user = await prisma.user.findUnique({
        where: {
            id: userId
        }
    })
    if (!user) throw new Error("User Not Found");
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) throw new Error("Wrong Password");

    await prisma.$transaction(async (tx) => {
        const ownedGroups = await tx.grupos.findMany({
            where: {
                ownerId: userId
            }, select: {
                id: true
            }
        })
        await removeGroups(tx, ownedGroups.map(g => g.id));
        await tx.result.deleteMany({
            where: {
                submission: {
                    userId: userId
                }
            }
        })
        await tx.submission.deleteMany({ where: { userId: userId } })
        await tx.challengeParticipants.deleteMany({ where: { userId: userId } })
        await tx.groupMember.deleteMany({ where: { userId: userId } })
        await tx.message.deleteMany({ where: { userId: userId } })
        await tx.user.delete({ where: { id: userId } })
    })
    return;
}

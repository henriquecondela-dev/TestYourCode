import prisma from "../lib/prisma.js";
const ONLINE_SECONDS = 15;
export async function sendMessage(userId, content) {
    if (!content || content.trim() === "") throw new Error("Empty Message");
    const text = content.trim();
    if (text.length > 500) throw new Error("Message Too Long");
    const lastMessage = await prisma.message.findFirst({
        where: {
            userId: userId
        }, orderBy: {
            id: "desc"
        }
    })
    if (lastMessage && Date.now() - new Date(lastMessage.createdAt).getTime() < 1000) throw new Error("Too Fast");
    const message = await prisma.message.create({
        data: {
            userId: userId,
            content: text
        }, select: {
            id: true,
            content: true,
            createdAt: true,
            user: {
                select: {
                    username: true,
                    avatar: true,
                    avatarColor: true
                }
            }
        }
    })
    await updateLastSeen(userId);
    return message;
}
export async function syncChat(userId, after) {
    await updateLastSeen(userId);
    const messages = await getMessages(after);
    const users = await getUsersStatus();
    return { messages, users };
}
async function updateLastSeen(userId) {
    await prisma.user.update({
        where: {
            id: userId
        }, data: {
            lastSeenAt: new Date()
        }
    })
}
async function getMessages(after) {
    const select = {
        id: true,
        content: true,
        createdAt: true,
        user: {
            select: {
                username: true,
                avatar: true,
                avatarColor: true
            }
        }
    }
    if (after === 0) {
        const lastMessages = await prisma.message.findMany({
            orderBy: {
                id: "desc"
            },
            take: 50,
            select: select
        })
        return lastMessages.reverse();
    }
    const newMessages = await prisma.message.findMany({
        where: {
            id: {
                gt: after
            }
        }, orderBy: {
            id: "asc"
        },
        take: 100,
        select: select
    })
    return newMessages;
}
async function getUsersStatus() {
    const limit = new Date(Date.now() - ONLINE_SECONDS * 1000);
    const users = await prisma.user.findMany({
        select: {
            id: true,
            username: true,
            avatar: true,
            avatarColor: true,
            lastSeenAt: true
        }, orderBy: {
            username: "asc"
        }
    })
    const playing = await prisma.challengeParticipants.findMany({
        where: {
            challenge: {
                status: "RUNNING"
            }
        }, select: {
            userId: true
        }
    })
    const playingIds = playing.map(p => p.userId);
    const list = users.map((user) => {
        let status = "offline";
        if (user.lastSeenAt && user.lastSeenAt >= limit) {
            status = playingIds.includes(user.id) ? "playing" : "online";
        }
        return {
            username: user.username,
            avatar: user.avatar,
            avatarColor: user.avatarColor,
            status: status
        }
    })
    return list;
}

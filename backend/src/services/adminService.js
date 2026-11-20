import prisma from "../lib/prisma.js";
import { getAccessToken, sendEmail } from "./emailService.js";

const DAILY_LIMIT = 450;

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function personalize(message, username) {
    return "Olá " + username + ",\n\n" + message.replaceAll("{username}", username);
}

export async function broadcast(subject, message, test) {
    if (!subject?.trim() || !message?.trim()) {
        throw new Error("Subject And Message Required");
    }
    let users;
    if (test) {
        users = [{ username: process.env.GMAIL_NAME || "admin", email: process.env.GMAIL_USER }];
    } else {
        users = await prisma.user.findMany({
            select: {
                username: true,
                email: true
            }
        });
    }
    if (users.length > DAILY_LIMIT) {
        throw new Error("Too Many Users For One Day");
    }
    const accessToken = await getAccessToken();
    const failed = [];
    for (const user of users) {
        try {
            await sendEmail(accessToken, user.email, subject.trim(), personalize(message.trim(), user.username));
        } catch (error) {
            failed.push({ email: user.email, error: error.message });
        }
        await wait(300);
    }
    return {
        total: users.length,
        sent: users.length - failed.length,
        failed: failed
    };
}

export async function sendToUser(email, subject, message) {
    if (!email?.trim() || !subject?.trim() || !message?.trim()) {
        throw new Error("Email, Subject And Message Required");
    }
    const user = await prisma.user.findUnique({
        where: {
            email: email.trim()
        },
        select: {
            username: true,
            email: true
        }
    });
    if (!user) {
        throw new Error("User Not Found");
    }
    const accessToken = await getAccessToken();
    await sendEmail(accessToken, user.email, subject.trim(), personalize(message.trim(), user.username));
    return {
        sent: user.email
    };
}

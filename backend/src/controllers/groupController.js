
import * as groupService from "../services/groupService.js";
import Prisma from "@prisma/client";
export async function createGroup(req, res) {
    try {
        const { name } = req.body;
        const { id } = req.user;
        const group = await groupService.createGroup(name, id);
        res.status(201).json({
            message: "Group created successfully",
            id: group.id,
            ownerId: group.ownerId,
            name: group.name,
            createdAt: group.createdAt,
            updatedAt: group.updatedAt
        })
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002"
        ) {
            return res.status(409).json({
                message: "Group name in use"
            });
        };
        res.status(500).json({
            message: `Internal error : ${error.message}`
        });
    }
}
export async function deleteGroup(req, res) {
    try {
        const { id } = req.params;
        const ownerId = req.user.id;
        await groupService.deleteGroup(Number(id), ownerId);
        res.status(200).json({
            message: "Group deleted"
        })
    } catch (error) {
        if (error.message === "Group not found") {
            return res.status(404).json({
                message: error.message
            })
        }

        if (error.message.startsWith("Permission")) {
            return res.status(403).json({
                message: error.message
            })
        }

        res.status(500).json({
            message: error.message
        })
    }
}

export async function getGroups(req, res) {
    try {
        const groups = await groupService.getGroups();
        res.status(200).json({
            message: "Groups List",
            groups: groups.map(group => ({
                id: group.id,
                name: group.name,
                ownerId: group.ownerId,
                createdAt: group.createdAt
            }))
        })

    } catch (error) {
        res.status(404).json({
            message: error.message
        })
    }

}

export async function getMyGroups(req, res) {
    try {
        const mygroups = await groupService.getMyGroups(Number(req.user.id));
        res.status(200).json({
            message: "Your goups:",
            groups: mygroups.map(group => ({
                id: group.id,
                name: group.name,
                createdAt: group.createdAt
            }))

        })
    } catch (error) {
        res.status(404).json({
            message: error.message
        })
    }
}
export async function joinInGroup(req, res) {
    try {
        const userId = Number(req.user.id);
        const { id } = req.params;
        await groupService.joinInGroup(userId, Number(id));
        res.status(200).json({
            message: "Joined sucecessfully"
        })
    } catch (error) {
        if (error.message.trim() === "Group Not Found") {
            return res.status(404).json({
                message: error.message
            })
        } else if (error.message === "Alredy a member") {
            return res.status(409).json({
                message: error.message
            })
        }
        res.status(500).json({
            message: error.message
        })
    }

}

export async function leaveGroup(req, res) {
    try {
        const groupId = Number(req.params.id);
        const userId = Number(req.user.id);
        await groupService.leaveGroup(userId, groupId);
        res.status(200).json({
            message: "You left the group successfully"
        })
    } catch (error) {
        if (error.message.trim() === "Group Not Found") {
            return res.status(404).json({
                message: error.message
            })
        } else if (error.message.trim() === "You are the owner, can't leave!"
            || error.message === "NOT A MEMBER") {
            return res.status(409).json({
                message: error.message
            })
        }
        res.status(500).json({
            message: error.message
        })
    }
}
export async function getChallenges(req, res) {
    try {
        const groupId = Number(req.params.groupId);
        const userId = Number(req.user.id);
        const challenges = await groupService.getChallenges(groupId, userId);
        res.status(200).json({
            message: "Group challenges:",
            challenges: challenges.challenges
        })
    } catch (error) {
        if (error.message.trim() === "Group Not Found") {
            return res.status(404).json({
                message: error.message
            })
        } else if (error.message.trim() === "YOU ARE NOT THE OWNER") {
            return res.status(403).json({
                message: error.message
            })
        }
        res.status(500).json({
            message: error.message
        })
    }
}
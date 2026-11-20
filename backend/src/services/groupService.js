import prisma from "../lib/prisma.js";
export async function createGroup(name, id) {
    if (!name || name.trim() === "") {
        throw new Error("Name not provided");
    }
    const group = await prisma.grupos.create({
        data: {
            name,
            ownerId: id
        }
    });
    await prisma.groupMember.create({
        data: {
            groupId: group.id,
            userId: id,
            role: "OWNER"
        }
    })
    return group;
}
export async function getGroups() {
    const groups = await prisma.grupos.findMany({
        orderBy:{
            createdAt:"desc"
        }
    });
    //console.log(groups)
    if (groups.length === 0) {
        throw new Error("No groups available")
    }
    return groups;

}
export async function deleteGroup(id, ownerid) {

    const group = await prisma.grupos.findUnique({
        where: { id: Number(id) }
    })
    if (!group) {
        throw new Error("Group not found")
    }
    if (group.ownerId !== Number(ownerid)) {
        throw new Error("Permission denied! This group does not belongs to you")
    }
    await prisma.$transaction(async (tx) => {
        await removeGroups(tx, [Number(id)]);
    })
    return;
}

export async function removeGroups(tx, groupIds) {
    if (groupIds.length === 0) return;
    const challenges = await tx.challenge.findMany({
        where: {
            groupId: { in: groupIds }
        }, select: {
            id: true
        }
    })
    const challengeIds = challenges.map(c => c.id);
    await tx.result.deleteMany({ where: { challengeId: { in: challengeIds } } })
    await tx.submission.deleteMany({ where: { challengeId: { in: challengeIds } } })
    await tx.challengeParticipants.deleteMany({ where: { challengeId: { in: challengeIds } } })
    await tx.challenge.deleteMany({ where: { groupId: { in: groupIds } } })
    await tx.groupMember.deleteMany({ where: { groupId: { in: groupIds } } })
    await tx.grupos.deleteMany({ where: { id: { in: groupIds } } })
}

export async function getMyGroups(ownerId) {
    const mygroups = await prisma.grupos.findMany({
        where: {
            ownerId: Number(ownerId)
        },orderBy:{
            createdAt:"desc"
        }, include: {
            _count: {
                select: {
                    member: true,
                    challenges: true
                }
            }
        }
    })
    return mygroups;
}
export async function joinInGroup(userId, groupId) {
    const group = await prisma.grupos.findUnique({
        where: {
            id: groupId
        }
    })
    if (!group) throw new Error("Group Not Found");
    const alreadyMember = await prisma.groupMember.findUnique({
        where: {
            userId_groupId: {
                userId: userId, groupId: groupId
            }
        }
    })
    if (alreadyMember) throw new Error("Already a member");
    const member = await prisma.groupMember.create({
        data: {
            userId: userId, groupId: groupId, role: "MEMBER"
        }
    })
    return member;
}

export async function leaveGroup(userId, groupId) {
    const group = await prisma.grupos.findUnique({
        where: {
            id: groupId
        }
    })
    if (!group) throw new Error("Group Not Found");
    if (group.ownerId === userId) throw new Error("You are the owner, can't leave!");
    //console.log(typeof groupId)
    const isMember = await prisma.groupMember.findUnique({
        where: {
            userId_groupId: {
                userId: userId, groupId: groupId
            }
        }
    })
    //console.log(isMember)
    if (!isMember) throw new Error("NOT A MEMBER");
    await prisma.groupMember.delete({
        where: {
            userId_groupId: {
                userId: userId, groupId: groupId
            }
        }
    })
    return;
}
export async function getChallenges(groupId, userId) {
    const group = await prisma.grupos.findUnique({
        where: {
            id: Number(groupId)
        }
    })
    if (!group) throw new Error("Group Not Found");
    const challenges = await prisma.grupos.findUnique({
        where: {
            id: groupId
        }, include: {
            challenges: {
                select: {
                    id: true,
                    title: true,
                    problem: true,
                    startedAt: true,
                    status: true,
                    language:true
                }, orderBy: {
                    createdAt: "desc"
                }
            }
        }
    })
    /*const challenges= await prisma.challenge.findMany({
        where:{
            groupId:groupId
        }
    })*/
    return challenges;
}
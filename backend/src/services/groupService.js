import prisma from "../lib/prisma.js";
export async function createGroup(name,id){
    const group=await prisma.grupos.create({
        data:{
            name,
            ownerId: id
        }
    });
    return group;
}
export async function deleteGroup(id,ownerid){
    const group=await prisma.grupos.findUnique({
        where:{id:Number(id)}
    })
    if(!group){
        throw new Error("Group not found")
    }
    //console.log(group)
    //console.log(group.ownerId)
    if(group.ownerId !==Number(ownerid)){
        throw new Error("Permission denied! This group does not belongs to you")
    }
    await prisma.grupos.delete({where:{id:Number(id)}})
    return;
}
import * as groupService from "../services/groupService.js";
import Prisma from "@prisma/client";
export async function createGroup(req, res) {
    try{
        const {name} =req.body;
        const {id}=req.user;
        const group=await groupService.createGroup(name,id);
        res.status(201).json({
            message:"Group created successfully",
            id:group.id,
            ownerId:group.ownerId,
            name:group.name,
            createdAt:group.createdAt,
            updatedAt:group.updatedAt
        })
    }catch(error){
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002"
        ){
            return res.status(409).json({
                message: "Nome de grupo ja em uso"
            });
        };
        res.status(500).json({
            message: `Internal error : ${error.message}`
        });
    }
}
export async function deleteGroup(req, res){
    try{
        const {id}=req.params;
        const ownerId=req.user.id;
        await groupService.deleteGroup(Number(id),ownerId);
        res.status(200).json({
            message:"Group deleted"
        })
    }catch(error){
        //console.error(error);
        res.status(401).json({
            message:error.message
        })
    } 
}
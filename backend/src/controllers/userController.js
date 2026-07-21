
import * as userService from "../services/userServices.js";
export  async function getUsers(req, res){
   try{
       const users= await userService.getUsers();
       res.status(200).json(
        {
            message: `Total of users: ${users.numberOfUsers}`,
            users: users.users.map(user => ({
                id: user.id,
                username: user.username,
                email: user.email,
                createdAt: user.createdAt          
            }))
        });
    }catch(error){
        res.status(500).json({  
            message: "Erro ao listar usuários"
        });
    }
}
export async function me(req,res){
    try{
        const user= await userService.me(req.user);
        //console.log(req.user)
        res.json({
            message: "User Profile:",
            id:user.id,
            username: user.username,
            email:user.email,
            createdAt:user.createdAt,
            groups:user.groups.map(group=>({
                name:group.name
            }))
        });
    }catch(error){
        res.status(404).json({
            message:error.message
        })
    }
}
export async function deleteUser(req,res){
    try{
        const {id}=req.params;
        await userService.deleteUser(id);
        res.status(200).json({
            message: "Usuário deletado com sucesso"
        });
    }catch(error){
        res.status(401).json({
            message: "Erro ao deletar usuário"
        });
    }
};

import * as userService from "../services/userServices.js";
export  async function getUsers(req, res){
   try{
       const users= await userService.getUsers();
       res.json(
        {
            message: `Total de usuários: ${users.numberOfUsers}`,
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
export async function createUser(req,res){
    try{
        const {username, email, password}=req.body;
        const user= await userService.createUser(username, email, password);
            res.status(201).json(
                {
                    message: "Usuário criado com sucesso",
                    user:user
                }
            );
    }catch(error){
        console.error(error);
        if(error.code === 'P2002'){
            res.status(400).json(
                {
                    message: "Erro: Usuário ja existe"
                }
            )
        }
        res.status(500).json(
            {
                message: "Erro ao criar usuário"
            }
        )
    }
}
export async function getUserProfile(req,res){
    try{
        const {id}=req.params;
        const user= await userService.getUserProfile(id);
        res.json({
            message: "Perfil do usuário",
            user: user
        });
    }catch(error){
        res.status(500).json({
            message: "Erro ao listar perfil do usuário"
        });
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
        res.status(500).json({
            message: "Erro ao deletar usuário"
        });
    }
};
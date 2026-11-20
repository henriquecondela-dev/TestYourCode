
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
            message: "Could not list users"
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
            avatar:user.avatar,
            avatarColor:user.avatarColor,
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
export async function saveAvatar(req, res) {
    try {
        const userId = Number(req.user.id);
        const { avatar, avatarColor } = req.body;
        const saved = await userService.saveAvatar(userId, avatar, avatarColor);
        res.status(200).json({
            message: "Avatar saved",
            avatar: saved.avatar,
            avatarColor: saved.avatarColor
        })
    } catch (error) {
        if (error.message === "Invalid Avatar" || error.message === "Invalid Color") {
            return res.status(400).json({
                message: error.message
            })
        }
        res.status(500).json({
            message: error.message
        })
    }
}
export async function changePassword(req, res) {
    try {
        const userId = Number(req.user.id);
        const { currentPassword, newPassword } = req.body;
        await userService.changePassword(userId, currentPassword, newPassword);
        res.status(200).json({
            message: "Password changed"
        })
    } catch (error) {
        if (error.message === "Wrong Password") {
            return res.status(401).json({
                message: "The current password is wrong"
            })
        } else if (error.message === "Weak Password" || error.message === "Missing Fields") {
            return res.status(400).json({
                message: error.message
            })
        }
        res.status(500).json({
            message: error.message
        })
    }
}
export async function deleteAccount(req, res) {
    try {
        const userId = Number(req.user.id);
        const { password } = req.body;
        await userService.deleteAccount(userId, password);
        res.status(200).json({
            message: "Account deleted"
        })
    } catch (error) {
        if (error.message === "Wrong Password") {
            return res.status(401).json({
                message: "The password is wrong"
            })
        } else if (error.message === "Missing Fields") {
            return res.status(400).json({
                message: error.message
            })
        }
        res.status(500).json({
            message: error.message
        })
    }
}

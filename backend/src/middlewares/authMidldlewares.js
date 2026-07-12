import jwt from "jsonwebtoken";
import "dotenv/config"
export default function authMiddleware(req, res, next){
    const {authorization}= req.headers;
    if(!authorization){
        return res.status(401).json({
            message:"Token nao informado."   
        });
    }
    const token=authorization.split(" ")[1];
    try{
        const decodedToken=jwt.verify(token, process.env.JWT_SECRET);
        req.user=decodedToken;
        next();
    }catch(error){
        return res.status(401).json({
            message:"Token invalido"
        });
    }
}
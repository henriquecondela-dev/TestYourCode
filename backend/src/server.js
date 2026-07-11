import "dotenv/config";
import express from "express";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
const app = express();
function newrequest(req, res, next) {
    console.log("Novo Pedido Recebido!");
    next();
}
function loginfo(req, res, next) {
    console.log(`Metodo: ${req.method}`);
    console.log(`URL: ${req.url}`);
    
    next();
}
app.use(express.json());
app.use(newrequest);
app.use(loginfo);
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.listen(process.env.PORT, () => {
    console.log(`Servidor rodando na porta ${process.env.PORT}`);
});
/*
app.get("/", (request, response) => {
    //console.log("Requisição recebida na rota /");
    response.send("Bem vindo ao TestYourCode");
});
app.get("/users", (request, response) => {
   // console.log("Requisição recebida na rota /users");
    //response.send("lista de usuraios");
    response.json(
        {
            message: "Lista de usuários",
            users: [
                {
                    id: 1,
                    name: "João",
                    email: "joao@example.com"
                },
                {
                    id: 2,
                    name: "Maria",
                    email: "maria@example.com"
                }
            ]
        }
    );
});
app.post("/users", (request, response) => {
    response.json(
        {
            message: "Usuário criado com sucesso"
        }
    );
})*/

/*const http = require("http");
const server = http.createServer((request, response) => {
    if (request.url === "/users") {
        response.write("/frontend/pages/challenge.html");
        response.end();
    } else if (request.url === "/") {
        response.write("Welcome to the home  page");
        response.end();
    }
});
server.listen(3000, () => {
    console.log("Server running on port 3000");
});*/
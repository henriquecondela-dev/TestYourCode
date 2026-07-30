
import express from "express";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import challengeRoutes from "./routes/challengeRoutes.js"
import authMiddleware from "./middlewares/authMidldlewares.js";
import logger from "./middlewares/logger.js";
import groupRoutes from "./routes/groupRoutes.js"
import cors from "cors";
import { apiReference } from "@scalar/express-api-reference"
import openapiDocument from "./docs/openAPI.js";

const app = express();

app.use(express.json());
app.use(cors());
//app.use(newrequest);

app.use(logger);
app.use("/api-docs", apiReference({
    spec: {
        content: openapiDocument
    }
}));
app.use("/api/auth", authRoutes);
app.use("/api/users", authMiddleware, userRoutes);
app.use("/api/groups", authMiddleware, groupRoutes);
app.use("/api/challenges", authMiddleware, challengeRoutes);
export default app;
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
/*const http = require("http")
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
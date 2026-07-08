const http = require("http");

const server = http.createServer((request, response) => {
    if (request.url === "/users") {
        response.write("/frontend/pages/challenge.html");
        response.end();
    } else if (request.url === "/") {
        response.write("Welcome to the home page");
        response.end();
    }
});

server.listen(3000, () => {
    console.log("Server running on port 3000");
});
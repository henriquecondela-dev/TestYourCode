const openapiDocument = {
    "openapi": "3.0.0",
    "info": {
        "title": "TestYourCode API",
        "description": "API para plataforma de desafios de programação",
        "version": "1.0.0"
    },
    "servers": [
        {
            "url": "http://localhost:3000"
            //"url": "http://10.153.230.113:3000"
        }
    ],
    "paths": {
        "/api/auth/signup": {
            "post": {
                "summary": "Criar usuário",
                "tags": [
                    "Auth"
                ],
                "requestBody": {
                    "required": true,
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "username": {
                                        "type": "string",
                                        "example": "henrique"
                                    },
                                    "email": {
                                        "type": "string",
                                        "example": "henrique@gmail.com"
                                    },
                                    "password": {
                                        "type": "string",
                                        "example": "Password123"
                                    }
                                }
                            }
                        }
                    }
                },
                "responses": {
                    "201": {
                        "description": "Usuário criado com sucesso"
                    },
                    "409": {
                        "description": "Email ou username já existe"
                    },
                    "500": {
                        "description": "Erro interno ao criar usuario"
                    }
                }
            }
        },
        "/api/auth/login": {
            "post": {
                "tags": [
                    "Auth"
                ],
                "summary": "Login de usuário",
                "requestBody": {
                    "required": true,
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "email": {
                                        "type": "string",
                                        "example": "henrique@gmail.com"
                                    },
                                    "password": {
                                        "type": "string",
                                        "example": "Password123"
                                    }
                                }
                            }
                        }
                    }
                },
                "responses": {
                    "200": {
                        "description": "Login realizado com sucesso",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "message": {
                                            "type": "string",
                                            "example": "Login successful"
                                        },
                                        "token": {
                                            "type": "string",
                                            "example": "jwt_token_here"
                                        },
                                        "user": {
                                            "type": "object",
                                            "properties": {
                                                "id": {
                                                    "type": "integer",
                                                    "example": 1
                                                },
                                                "username": {
                                                    "type": "string",
                                                    "example": "henrique"
                                                },
                                                "email": {
                                                    "type": "string",
                                                    "example": "henrique@gmail.com"
                                                },
                                                "avatar": {
                                                    "type": "string",
                                                    "nullable": true,
                                                    "example": "avatar9.jpg"
                                                },
                                                "avatarColor": {
                                                    "type": "string",
                                                    "nullable": true,
                                                    "example": null
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "401": {
                        "description": "Credenciais inválidas"
                    }
                }
            }
        },
        "/api/users": {
            "get": {
                "tags": [
                    "Users"
                ],
                "summary": "Get all users",
                "description": "Returns all registered users.",
                "security": [
                    {
                        "bearerAuth": []
                    }
                ],
                "responses": {
                    "200": {
                        "description": "Users retrieved successfully",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "message": {
                                            "type": "string",
                                            "example": "Total of users: 10"
                                        },
                                        "users": {
                                            "type": "array",
                                            "items": {
                                                "type": "object",
                                                "properties": {
                                                    "id": {
                                                        "type": "integer",
                                                        "example": 1
                                                    },
                                                    "username": {
                                                        "type": "string",
                                                        "example": "henrique"
                                                    },
                                                    "email": {
                                                        "type": "string",
                                                        "example": "henrique@email.com"
                                                    },
                                                    "createdAt": {
                                                        "type": "string",
                                                        "format": "date-time"
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "500": {
                        "description": "Internal server error"
                    }
                }
            }
        },
        "/api/users/me": {
            "get": {
                "tags": [
                    "Users"
                ],
                "summary": "Get authenticated user profile",
                "description": "Returns the profile information of the logged user.",
                "security": [
                    {
                        "bearerAuth": []
                    }
                ],
                "responses": {
                    "200": {
                        "description": "User profile retrieved successfully",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "message": {
                                            "type": "string",
                                            "example": "User Profile:"
                                        },
                                        "id": {
                                            "type": "integer",
                                            "example": 1
                                        },
                                        "username": {
                                            "type": "string",
                                            "example": "henrique"
                                        },
                                        "email": {
                                            "type": "string",
                                            "example": "henrique@email.com"
                                        },
                                        "avatar": {
                                            "type": "string",
                                            "nullable": true,
                                            "example": "avatar9.jpg"
                                        },
                                        "avatarColor": {
                                            "type": "string",
                                            "nullable": true,
                                            "example": null
                                        },
                                        "createdAt": {
                                            "type": "string",
                                            "format": "date-time"
                                        },
                                        "groups": {
                                            "type": "array",
                                            "items": {
                                                "type": "object",
                                                "properties": {
                                                    "name": {
                                                        "type": "string",
                                                        "example": "Programming Group"
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "404": {
                        "description": "Profile not found"
                    }
                }
            },
            "delete": {
                "tags": [
                    "Users"
                ],
                "summary": "Delete my account",
                "description": "Deletes the account of the logged user after checking the password. Also deletes the groups the user owns (with their challenges, submissions and results), the user's submissions, participations, memberships and chat messages.",
                "security": [
                    {
                        "bearerAuth": []
                    }
                ],
                "requestBody": {
                    "required": true,
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "password": {
                                        "type": "string",
                                        "example": "Password123"
                                    }
                                }
                            }
                        }
                    }
                },
                "responses": {
                    "200": {
                        "description": "Account deleted",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "message": {
                                            "type": "string",
                                            "example": "Account deleted"
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "400": {
                        "description": "Password not sent",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "message": {
                                            "type": "string",
                                            "example": "Missing Fields"
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "401": {
                        "description": "Wrong password",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "message": {
                                            "type": "string",
                                            "example": "The password is wrong"
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "500": {
                        "description": "Internal server error",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "message": {
                                            "type": "string",
                                            "example": "Internal server error"
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        "/api/users/me/avatar": {
            "put": {
                "tags": [
                    "Users"
                ],
                "summary": "Change my avatar",
                "description": "Saves an image avatar (avatar1.jpg to avatar14.jpg) or a letter color (black, green, blue, red, orange, purple). If an image is sent, the color is saved as null. Sending both as null goes back to the default letter.",
                "security": [
                    {
                        "bearerAuth": []
                    }
                ],
                "requestBody": {
                    "required": true,
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "avatar": {
                                        "type": "string", "nullable": true,
                                        "example": "avatar9.jpg"
                                    },
                                    "avatarColor": {
                                        "type": "string", "nullable": true,
                                        "example": null
                                    }
                                }
                            }
                        }
                    }
                },
                "responses": {
                    "200": {
                        "description": "Avatar saved",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "message": {
                                            "type": "string",
                                            "example": "Avatar saved"
                                        },
                                        "avatar": {
                                            "type": "string",
                                            "nullable": true,
                                            "example": "avatar9.jpg"
                                        },
                                        "avatarColor": {
                                            "type": "string",
                                            "nullable": true,
                                            "example": null
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "400": {
                        "description": "Invalid avatar or color",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "message": {
                                            "type": "string",
                                            "example": "Invalid Avatar"
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "500": {
                        "description": "Internal server error",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "message": {
                                            "type": "string",
                                            "example": "Internal server error"
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        "/api/users/me/password": {
            "put": {
                "tags": [
                    "Users"
                ],
                "summary": "Change my password",
                "description": "Checks the current password and saves the new one. The new password needs at least 6 characters, an upper case, a lower case and a number.",
                "security": [
                    {
                        "bearerAuth": []
                    }
                ],
                "requestBody": {
                    "required": true,
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "currentPassword": {
                                        "type": "string",
                                        "example": "Password123"
                                    },
                                    "newPassword": {
                                        "type": "string",
                                        "example": "NewPassword456"
                                    }
                                }
                            }
                        }
                    }
                },
                "responses": {
                    "200": {
                        "description": "Password changed",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "message": {
                                            "type": "string",
                                            "example": "Password changed"
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "400": {
                        "description": "Missing fields or weak password",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "message": {
                                            "type": "string",
                                            "example": "Weak Password"
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "401": {
                        "description": "The current password is wrong",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "message": {
                                            "type": "string",
                                            "example": "The current password is wrong"
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "500": {
                        "description": "Internal server error",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "message": {
                                            "type": "string",
                                            "example": "Internal server error"
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        "/api/groups/": {
            "post": {
                "tags": ["Groups"],
                "summary": "Create a new group",
                "description": "Creates a group and automatically adds the creator as OWNER",
                "security": [{ "bearerAuth": [] }],
                "requestBody": {
                    "required": true,
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "name": {
                                        "type": "string",
                                        "example": "Java Developers"
                                    }
                                },
                                "required": ["name"]
                            }
                        }
                    }
                },
                "201": {
                    "description": "Group created successfully",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "message": {
                                        "type": "string",
                                        "example": "Group created successfully"
                                    },
                                    "id": {
                                        "type": "integer",
                                        "example": 1
                                    },
                                    "ownerId": {
                                        "type": "integer",
                                        "example": 5
                                    },
                                    "name": {
                                        "type": "string",
                                        "example": "Java Developers"
                                    },
                                    "createdAt": {
                                        "type": "string",
                                        "format": "date-time"
                                    },
                                    "updatedAt": {
                                        "type": "string",
                                        "format": "date-time"
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        "/api/groups": {
            "get": {
                "tags": ["Groups"],
                "summary": "Get all groups",
                "description": "Returns a list of all available groups.",
                "security": [
                    {
                        "bearerAuth": []
                    }
                ],
                "responses": {
                    "200": {
                        "description": "Groups retrieved successfully",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "message": {
                                            "type": "string",
                                            "example": "Groups List"
                                        },
                                        "groups": {
                                            "type": "array",
                                            "items": {
                                                "type": "object",
                                                "properties": {
                                                    "id": {
                                                        "type": "integer",
                                                        "example": 1
                                                    },
                                                    "name": {
                                                        "type": "string",
                                                        "example": "Java Developers"
                                                    },
                                                    "ownerId": {
                                                        "type": "integer",
                                                        "example": 5
                                                    },
                                                    "createdAt": {
                                                        "type": "string",
                                                        "format": "date-time",
                                                        "example": "2026-07-21T15:30:00.000Z"
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "404": {
                        "description": "No groups found",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "message": {
                                            "type": "string",
                                            "example": "No groups available"
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "401": {
                        "description": "Unauthorized - Missing or invalid token",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "message": {
                                            "type": "string",
                                            "example": "Token not provided"
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        "/api/groups/my": {
            "get": {
                "tags": [
                    "Groups"
                ],
                "summary": "Get my groups",
                "description": "Returns all groups created by the authenticated user, with the number of members and challenges. Returns an empty list when the user has no groups.",
                "security": [
                    {
                        "bearerAuth": []
                    }
                ],
                "responses": {
                    "200": {
                        "description": "User groups retrieved successfully",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "message": {
                                            "type": "string",
                                            "example": "Your groups:"
                                        },
                                        "groups": {
                                            "type": "array",
                                            "items": {
                                                "type": "object",
                                                "properties": {
                                                    "id": {
                                                        "type": "integer",
                                                        "example": 1
                                                    },
                                                    "name": {
                                                        "type": "string",
                                                        "example": "Backend Developers"
                                                    },
                                                    "createdAt": {
                                                        "type": "string",
                                                        "format": "date-time",
                                                        "example": "2026-07-21T16:00:00.000Z"
                                                    },
                                                    "members": {
                                                        "type": "integer",
                                                        "example": 4
                                                    },
                                                    "challenges": {
                                                        "type": "integer",
                                                        "example": 3
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "401": {
                        "description": "Unauthorized - Invalid or missing token",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "message": {
                                            "type": "string",
                                            "example": "Token not provided"
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        "/api/groups/{id}/join": {
            "post": {
                "tags": [
                    "Groups"
                ],
                "summary": "Join a group",
                "description": "Allows the authenticated user to join an existing group.",
                "security": [
                    {
                        "bearerAuth": []
                    }
                ],
                "parameters": [
                    {
                        "name": "id",
                        "in": "path",
                        "required": true,
                        "description": "ID of the group to join",
                        "schema": {
                            "type": "integer",
                            "example": 1
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "Successfully joined the group",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "message": {
                                            "type": "string",
                                            "example": "Joined successfully"
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "404": {
                        "description": "Group not found",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "message": {
                                            "type": "string",
                                            "example": "Group Not Found"
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "409": {
                        "description": "User is already a member of this group",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "message": {
                                            "type": "string",
                                            "example": "Already a member"
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "500": {
                        "description": "Internal server error",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "message": {
                                            "type": "string",
                                            "example": "Internal server error"
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        "/api/groups/{id}/leave": {
            "delete": {
                "tags": [
                    "Groups"
                ],
                "summary": "Leave a group",
                "description": "Allows the authenticated user to leave a group. The group owner cannot leave the group.",
                "security": [
                    {
                        "bearerAuth": []
                    }
                ],
                "parameters": [
                    {
                        "name": "id",
                        "in": "path",
                        "required": true,
                        "description": "ID of the group to leave",
                        "schema": {
                            "type": "integer",
                            "example": 1
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "Successfully left the group",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "message": {
                                            "type": "string",
                                            "example": "You leaved the group successfully"
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "401": {
                        "description": "User cannot leave this group",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "message": {
                                            "type": "string",
                                            "examples": {
                                                "owner": "You are the owner, can't leave!",
                                                "notMember": "NOT A MEMBER"
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "404": {
                        "description": "Group not found",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "message": {
                                            "type": "string",
                                            "example": "Group Not Found"
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "500": {
                        "description": "Internal server error",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "message": {
                                            "type": "string",
                                            "example": "Internal server error"
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        "/api/groups/{id}": {
            "delete": {
                "tags": [
                    "Groups"
                ],
                "summary": "Delete a group",
                "description": "Deletes a group. Only the group owner is allowed to perform this action. Also deletes the group's challenges, participations, submissions, results and members.",
                "security": [
                    {
                        "bearerAuth": []
                    }
                ],
                "parameters": [
                    {
                        "name": "id",
                        "in": "path",
                        "required": true,
                        "description": "ID of the group to delete",
                        "schema": {
                            "type": "integer",
                            "example": 1
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "Group deleted successfully",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "message": {
                                            "type": "string",
                                            "example": "Group deleted"
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "403": {
                        "description": "User does not have permission to delete this group",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "message": {
                                            "type": "string",
                                            "examples": {
                                                "permission": "Permission denied! This group does not belongs to you"
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "404": {
                        "description": "Group not found",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "message": {
                                            "type": "string",
                                            "example": "Group not found"
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "500": {
                        "description": "Internal server error",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "message": {
                                            "type": "string",
                                            "example": "Internal server error"
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        "/api/groups/{groupId}/challenges": {
            "get": {
                "tags": [
                    "Groups"
                ],
                "summary": "Get group challenges",
                "description": "Returns all challenges from a group. Only the group owner can access this resource.",
                "security": [
                    {
                        "bearerAuth": []
                    }
                ],
                "parameters": [
                    {
                        "name": "groupId",
                        "in": "path",
                        "required": true,
                        "description": "ID of the group",
                        "schema": {
                            "type": "integer",
                            "example": 1
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "Challenges retrieved successfully",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "message": {
                                            "type": "string",
                                            "example": "Group challenges:"
                                        },
                                        "challenges": {
                                            "type": "array",
                                            "items": {
                                                "type": "object"
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "403": {
                        "description": "User does not have permission",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "message": {
                                            "type": "string",
                                            "example": "YOU ARE NOT THE OWNER"
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "404": {
                        "description": "Group not found",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "message": {
                                            "type": "string",
                                            "example": "Group Not Found"
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "500": {
                        "description": "Internal server error",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "message": {
                                            "type": "string",
                                            "example": "Internal error"
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        "/api/challenges": {
            "post": {
                "tags": ["Challenges"],
                "summary": "Create a challenge",
                "description": "Creates a new programming challenge inside a group. Only the group owner can create challenges.",
                "security": [
                    {
                        "bearerAuth": []
                    }
                ],
                "requestBody": {
                    "required": true,
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "required": [
                                    "groupId",
                                    "difficulty",
                                    "category",
                                    "durationSeconds",
                                    "language"
                                ],
                                "properties": {
                                    "groupId": {
                                        "type": "integer",
                                        "example": 1
                                    },
                                    "difficulty": {
                                        "type": "string",
                                        "enum": [
                                            "EASY",
                                            "MEDIUM",
                                            "HARD"
                                        ],
                                        "description": "Challenge difficulty.",
                                        "example": "EASY"
                                    },
                                    "category": {
                                        "type": "string",
                                        "enum": [
                                            "FUNDAMENTALS",
                                            "ARRAYS",
                                            "POO",
                                            "STRINGS",
                                            "ALGORITHMS",
                                            "PROBBLEM_SOLVING",
                                            "RANDOM"
                                        ],
                                        "description": "Challenge categories",
                                        "example": "ARRAYS"
                                    },
                                    "durationSeconds": {
                                        "type": "integer",
                                        "example": 600
                                    },
                                    "language": {
                                        "type": "string",
                                        "enum": [
                                            "JAVA",
                                            "JAVASCRIPT",
                                            "C",
                                            "CPP",
                                            "C_CHARP",
                                            "PHYTON"
                                        ],
                                        "decription": "Challenge languages",
                                        "example": "CPP"
                                    }
                                }
                            }
                        }
                    }
                },
                "responses": {
                    "201": {
                        "description": "Challenge created successfully",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "message": {
                                            "type": "string",
                                            "example": "Challenge created successfully"
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "400": {
                        "description": "Missing required data",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "message": {
                                            "type": "string",
                                            "example": "Missing required data"
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "403": {
                        "description": "User is not the group owner",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "message": {
                                            "type": "string",
                                            "example": "User is not the group owner"
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "404": {
                        "description": "Group not found",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "message": {
                                            "type": "string",
                                            "example": "Group not found"
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "409": {
                        "description": "Challenge already exists",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "message": {
                                            "type": "string",
                                            "example": "challenge aleredy exists"
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        "/api/challenges/{challengeId}": {
            "get": {
                "tags": ["Challenges"],
                "summary": "Get challenge details",
                "security": [
                    {
                        "bearerAuth": []
                    }
                ],
                "parameters": [
                    {
                        "name": "challengeId",
                        "in": "path",
                        "required": true,
                        "description": "ID of the challenge",
                        "schema": {
                            "type": "integer",
                            "example": 1
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "Challenge details returned"
                    },
                    "404": {
                        "description": "Challenge not found"
                    }
                }
            }
        },
        "/api/challenges/{challengeId}/participants": {
            "get": {
                "tags": ["Challenges"],
                "summary": "Get challenge participants",
                "security": [
                    {
                        "bearerAuth": []
                    }
                ],
                "parameters": [
                    {
                        "name": "challengeId",
                        "in": "path",
                        "required": true,
                        "description": "ID of the challenge",
                        "schema": {
                            "type": "integer",
                            "example": 1
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "Challenge participants returned. Each participant has id, username, avatar, avatarColor and submissions."
                    },
                    /*"409": {
                        "description": "No participants found"
                    }*/
                    "500": {
                        "description": "internal server error"
                    }
                }
            }
        },
        "/api/challenges/{challengeId}/start": {
            "post": {
                "tags": ["Challenges"],
                "summary": "Start challenge",
                "description": "Starts a challenge. Only the owner can start it.",
                "security": [
                    {
                        "bearerAuth": []
                    }
                ],
                "parameters": [
                    {
                        "name": "challengeId",
                        "in": "path",
                        "required": true,
                        "description": "ID of the challenge",
                        "schema": {
                            "type": "integer"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "Challenge started"
                    },
                    "403": {
                        "description": "Permission denied"
                    },
                    "404": {
                        "description": "Challenge not found"
                    }
                }
            }
        },
        "/api/challenges/{challengeId}/finish": {
            "patch": {
                "tags": ["Challenges"],
                "summary": "Finish challenge",
                "description": "Finishes a running challenge",
                "security": [
                    {
                        "bearerAuth": []
                    }
                ],
                "parameters": [
                    {
                        "name": "challengeId",
                        "in": "path",
                        "required": true,
                        "description": "ID of the challenge",
                        "schema": {
                            "type": "integer"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "Challenge finished"
                    },
                    "403": {
                        "description": "Cannot finish challenge"
                    },
                    "404": {
                        "description": "Challenge not found"
                    },
                    "500": {
                        "description": "internal error"
                    }
                }
            }
        },
        "/api/challenges/{challengeId}/submissions/all": {
            "post": {
                "tags": ["Challenges"],
                "summary": "Submit solutions to AI",
                "description": "Sends all the submitted solutions to AI and returns the results",
                "security": [
                    {
                        "bearerAuth": []
                    }
                ],
                "parameters": [
                    {
                        "name": "challengeId",
                        "in": "path",
                        "required": true,
                        "description": "ID of the challenge",
                        "schema": {
                            "type": "integer"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "Submissions sent"
                    },
                    "403": {
                        "description": "Cannot submit solutions"
                    },
                    "404": {
                        "description": "Challenge not found"
                    }
                }
            }
        },
        "/api/challenges/{challengeId}/submissions": {
            "post": {
                "tags": ["Challenges"],
                "summary": "Submit solution",
                "description": "Allows a participant to submit a solution.",
                "security": [
                    {
                        "bearerAuth": []
                    }
                ],
                "parameters": [
                    {
                        "name": "challengeId",
                        "in": "path",
                        "required": true,
                        "description": "ID of the challenge",
                        "schema": {
                            "type": "integer"
                        }
                    }
                ],
                "requestBody": {
                    "required": true,
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "required": [
                                    "type",
                                    "solution"
                                ],
                                "properties": {
                                    "type": {
                                        "type": "string",
                                        "example": "TEXT"
                                    },
                                    "solution": {
                                        "type": "string",
                                        "enum": [
                                            "TEXT",
                                            "FILE"
                                        ],
                                        "description": "Type of the solution to be submitted",
                                        "example": "#include<iostream>"
                                    },
                                }
                            }
                        }
                    }
                },
                "responses": {
                    "200": {
                        "description": "Solution submitted"
                    },
                    "403": {
                        "description": "User cannot submit solution"
                    },
                    "404": {
                        "description": "Challenge not found"
                    },
                    "409": {
                        "description": "Already submitted"
                    }
                }
            }
        },
        "/api/challenges/{challengeId}/join": {
            "post": {
                "tags": ["Challenges"],
                "summary": "Join challenge",
                "security": [
                    {
                        "bearerAuth": []
                    }
                ],
                "parameters": [
                    {
                        "name": "challengeId",
                        "in": "path",
                        "required": true,
                        "description": "ID of the challenge",
                        "schema": {
                            "type": "integer"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "Joined successfully"
                    },
                    "404": {
                        "description": "Challenge not found"
                    },
                    "500": {
                        "description": "Internal error"
                    }
                }
            }
        },
        "/api/challenges/{challengeId}/result": {
            "get": {
                "tags": ["Challenges"],
                "summary": "Get challenge results",
                "description": "Returns ranking and AI evaluation results.",
                "security": [
                    {
                        "bearerAuth": []
                    }
                ],
                "parameters": [
                    {
                        "name": "challengeId",
                        "in": "path",
                        "required": true,
                        "description": "ID of the challenge",
                        "schema": {
                            "type": "integer"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "Results returned. Each result has userId, username, avatar, avatarColor, rank, score, feedback and approved."
                    },
                    "404": {
                        "description": "Challenge not found"
                    }
                }
            }
        },
        "/api/challenges/{challengeId}/submissions/me": {
            "get": {
                "tags": ["Challenges"],
                "summary": "Get my submissions",
                "description": "Endpoint currently under development.",
                "security": [
                    {
                        "bearerAuth": []
                    }
                ],
                "parameters": [
                    {
                        "name": "challengeId",
                        "in": "path",
                        "required": true,
                        "description": "ID of the challenge",
                        "schema": {
                            "type": "integer"
                        }
                    }
                ],
                "responses": {
                    "404": {
                        "description": "Endpoint under development"
                    }
                }
            }
        },
        "/api/chat/messages": {
            "post": {
                "tags": [
                    "Chat"
                ],
                "summary": "Send a message",
                "description": "Sends a message to the general room. Max 500 characters and one message per second.",
                "security": [
                    {
                        "bearerAuth": []
                    }
                ],
                "requestBody": {
                    "required": true,
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "content": {
                                        "type": "string",
                                        "example": "Bora @kelvin"
                                    }
                                }
                            }
                        }
                    }
                },
                "responses": {
                    "201": {
                        "description": "Message sent",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "message": {
                                            "$ref": "#/components/schemas/ChatMessage"
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "400": {
                        "description": "Empty or too long message",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "message": {
                                            "type": "string",
                                            "example": "Empty Message"
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "429": {
                        "description": "More than one message per second",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "message": {
                                            "type": "string",
                                            "example": "Too Fast"
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "500": {
                        "description": "Internal server error",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "message": {
                                            "type": "string",
                                            "example": "Internal server error"
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        "/api/chat/sync": {
            "get": {
                "tags": [
                    "Chat"
                ],
                "summary": "Get new messages and who is online",
                "description": "Called every 3 seconds by the chat page. Returns the messages with id bigger than 'after' (the last 50 when after is 0) and the status of every user. Also marks the logged user as online.",
                "security": [
                    {
                        "bearerAuth": []
                    }
                ],
                "parameters": [
                    {
                        "name": "after",
                        "in": "query",
                        "required": false,
                        "description": "Id of the last message the page already has",
                        "schema": {
                            "type": "integer",
                            "example": 0
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "New messages and users status",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "messages": {
                                            "type": "array",
                                            "items": {
                                                "$ref": "#/components/schemas/ChatMessage"
                                            }
                                        },
                                        "users": {
                                            "type": "array",
                                            "items": {
                                                "type": "object",
                                                "properties": {
                                                    "username": {
                                                        "type": "string",
                                                        "example": "kelvin"
                                                    },
                                                    "avatar": {
                                                        "type": "string",
                                                        "nullable": true,
                                                        "example": "avatar12.jpg"
                                                    },
                                                    "avatarColor": {
                                                        "type": "string",
                                                        "nullable": true,
                                                        "example": null
                                                    },
                                                    "status": {
                                                        "type": "string",
                                                        "enum": ["online", "playing", "offline"],
                                                        "example": "playing"
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "500": {
                        "description": "Internal server error",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "message": {
                                            "type": "string",
                                            "example": "Internal server error"
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    ,
    "components": {
        "schemas": {
            "ChatMessage": {
                "type": "object",
                "properties": {
                    "id": {
                        "type": "integer",
                        "example": 128
                    },
                    "content": {
                        "type": "string",
                        "example": "Bora @kelvin"
                    },
                    "createdAt": {
                        "type": "string",
                        "format": "date-time"
                    },
                    "user": {
                        "type": "object",
                        "properties": {
                            "username": {
                                "type": "string",
                                "example": "henrique"
                            },
                            "avatar": {
                                "type": "string",
                                "nullable": true,
                                "example": "avatar9.jpg"
                            },
                            "avatarColor": {
                                "type": "string",
                                "nullable": true,
                                "example": null
                            }
                        }
                    }
                }
            }
        },
        "securitySchemes": {
            "bearerAuth": {
                "type": "http",
                "scheme": "bearer",
                "bearerFormat": "JWT"
            }
        }
    }
}
export default openapiDocument;
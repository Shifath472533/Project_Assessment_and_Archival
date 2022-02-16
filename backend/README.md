# Archieve-N-Assessment

## Run the Project

> npm install

> npm run server

## Some APIs

### For authentication:

-   Login: /api/auth/login

    -   Method: POST
    -   Headers:
        -   Key: Content-Type
        -   Value: application/json
    -   Body:
        -   username
        -   password

-   Authenticated User: /api/auth

    -   Method: GET
    -   Headers:
        -   Key: x-auth-token
        -   Value: A Unique Token Generated from login

### For Archive:

-   Find all the projects: /api/archive

    -   Method: GET
    -   Headers:
        -   Key: x-auth-token
        -   Value: A Unique Token Generated from login

-   Post the project: /api/archive

    -   Method: POST
    -   Headers:
        -   Key: x-auth-token
        -   Value: A Unique Token Generated from login
    -   Body (FormData):
        -   file
        -   title
        -   description
        -   year

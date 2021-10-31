## Sign-Up, Login, Searching NODE API  🚀🚀🚀

⚠ **Update 31st October 2021** : If running the code in this repo causes any issues, send me an e-mail at saikatm1997@gmail.com ⚠

Minimalistic, ready-to-use API for Sessions based Login, Sign-Up, Search User by Name or Phone Number using Node.js + Express and MongoDB, can be used as a starting point for another project that needs authentication and other CRUD projects.

## Features

- Login API with success/error messages
- Register API with success/error messages
- Protected Search User by username or phone no that needs authentication to access

## Prerequisites

- Node.js
- NPM
- MongoDB Atlas MongoURI



Install packages for Node backend

```
 cd ./rootOfThe Project
 npm install
 npm install -g nodemon
```

Start Server

```
 nodemon server
```

Backend endpoints:

```
/api/sign-up
/api/login
/api/search-user (Required Login)
```

```
Use the postman collection(added in root) for testing the APIs
For /api/sign-up 
{
    "name":"Saikat",
    "country":"India",
    "phone":"6296175399",
    "address":"Kolkata",
    "gender":"M",
    "password":"123456"
}

/api/login
{
    "phone":"6296175399",
    "password":"123456"
}

/api/search-user
{
    "query":"s"
}

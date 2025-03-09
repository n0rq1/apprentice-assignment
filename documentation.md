# Documentation for my take home assignment

---

# Table of Contents

1. [Node.js Application](#nodejs-application)
   - [Node.js](#nodejs)
   - [Express.js](#expressjs)
   - [Steps to Set Up Node.js and Express.js App](#steps-to-set-up-nodejs-and-expressjs-app)
   - [Implement Server](#implement-server)
   - [Run the Server](#run-the-server)

2. [Containerizing the Application with Docker](#containerizing-the-application-with-docker)

3. [GitHub Actions](#github-actions)

4. [Cloud Deployment](#cloud-deployment)

5. [Deployment Workflow](#deployment-workflow)

---

# Node.js application

### Node.js
> Node.js is a software platform for server-side and networking applications. Node.js contains a built-in, asynchronous I/O library for file, socket, and HTTP communication.

### Express.js
> Express.js is a popular Node.js framework, used to build web apps and APIs. It is referred to as "minimalist", as it mainly serves the basic needs of a web app, such as: handling HTTP requests, routing, and middleware integration. Despite being minimalist, developers have created many compatible packages to make it even more flexible. 

### Steps to set up Node.js and Express.js app
Check if Node is installed: 
```shell
node -v
npm -v
```

Initialize Node.js project:
```shell
npm init -y #Gives the package.json
```

Install Express.js:
```shell
npm install express #Gives the directory node_modules and package-lock.json
```

Create the server file:
```
*.js - I named mine server.js
```

### Implement server 
Add code to the server.js file:
```js
const express = require('express');
const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
    const response = {
      message: "My name is Austin",
      timestamp: Date.now()
    };
    res.json(response);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
```

- Start by importing the express module and store it as the const 'express'
- Create an Express app and store it as the const 'app'
- Next, we need to define the port we want to listen to. For now it will be 3000 until we actually deploy this
- Now, we need to define a route to listen to 'get' requests
    - The Express app variable comes with numerous methods: get, listen, post, put, delete, all, etc. but we want to have our app up and running so the data is retrievable. app.get is the most appropriate for this
    - app.get('/') means when we get 'get' requests to the root URL, we will respond accordingly
- We want to respond with a JSON with a message and a timestamp, so we will define an object and store it as 'response'. Finally, we will send a JSON response to the client using res.json(), which returns the object we defined earlier. Passing the variable 'response' into the function json() will send it as a properly formatted JSON to the client. 
- Finally we want to start our Express server and define what port we are listening on. This is achieved by app.listen(PORT,...). And every time we start the server, we just want to log that the server is up and running, and what port.

Made server.js with this tutorial: https://www.youtube.com/watch?v=SccSCuHhOw0

### Run the server:
```shell
node server.js
```

Should output to the console: 'Server is running on port xxxx' if done correctly :D

Now, the web app listens on the specified port, handles GET requests at /, and responds with a JSON object containing a message and a dynamic timestamp. 

---

# Containerizing the Application with Docker

---

# GitHub Actions

---

# Cloud Deployment

---

# Deployment Workflow
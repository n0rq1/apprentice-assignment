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
    - [Why containerize our app?](#why-containerize-our-app) 
   - [Docker](#docker)  
   - [Node Image Variants](#node-image-variants)  
   - [Make sure Docker is installed and the Docker daemon is running](#make-sure-docker-is-installed-and-the-docker-daemon-is-running)  
   - [Create Dockerfile](#create-dockerfile)  
   - [Dockerfile Breakdown](#dockerfile-breakdown)
   - [Build the Docker image](#build-the-docker-image)  
   - [Run the Docker Container](#run-the-docker-container)  
   - [Verify the container is running](#verify-the-container-is-running)  

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

### Why containerize our app?
> Containerizing our app serves a handful of purposes. One being that each person will have a consistent environment. Instead of fixing environment issues per person/machine, you can focus on one setup that works across all systems and solves the "it works on my machine" problem. Docker is all about isolation and package dependency. 

### Docker
> Docker is a platform that allows developers to build, share, and run container applications.  

### Node Image Variants
> According to the Docker documentation there are 3 main versions of Node Docker images. Regular, Alpine, and Slim. Each with different use cases, but what they mainly refer to is the underlying OS/Linux distribution and the set of pre-installed system utilities. These versions are specified as suffixes after the version number e.g. Node:20-Alpine, or no suffix for regular image, just Node:version.

Regular
> This is the recommended version if you don't know exactly what you need, it casts a pretty wide net. Based in Ubuntu or Debian, includes the full set of Linux utilities and libaries. This one seems to require the least amount of package management.

Alpine
> If you're looking for the lightest image possible, go with this one. Based in Alpine Linux which is designed to be extremely minimalistic.

Slim 
> From what I have read, this is the sweet spot between regular and Alpine. Based in Debian, but stripped down and removes most of the unnecessary tools.

https://hub.docker.com/_/node
https://github.com/nodejs/docker-node/blob/main/README.md#how-to-use-this-image

### Make sure Docker is installed and make sure Docker daemon is running
```shell
docker info
```
Docker should be recognized as a command if installed. If Docker info successfully runs, the last line in the output will let you know if the Docker daemon is running. If you see: ERROR Cannot connect to the Docker daemon..., Docker daemon is not running, so you need to start it via a command or start the Docker desktop app. If you don't see the ERROR, you should be good to go!

### Create Dockerfile

Create the file Dockerfile, in the same directory your server.js, package.json, and package-lock.json are in.

```Dockerfile
FROM node:16-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["node", "server.js"]
```

### Dockerfile Breakdown

```Dockerfile
FROM node:16-alpine
```
- The first thing we need at the top of our Dockerfile is define the base for our image
    - Since Node has already existing images, we don't need to reinvent the wheel and we can use one of their versions

```Dockerfile
WORKDIR /app
```
- We select a working directory in the container. In this case we set it as /app, if it doesn't exist, it will create it for us.
    - The working directory just tells Docker where all the commands will be executed

```Dockerfile
COPY package*.json ./
```
- Copies package.json and package-lock.json from the host machine to the container

```Dockerfile
RUN npm install
```
- We need to run: 'npm install' to install the dependencies specified in the package.json file. 


```Dockerfile
COPY . .
```
- This will copy everything current directory of the host to the current directory of the container (/app). The first '.' is defines the current directory of the host and the second '.' defines the current directory of the container. 

```Dockerfile
EXPOSE 3000
```
- This exposes a port to the host machine. This tells Docker that the container will listen on port 3000. From my understanding this is more like documentation for the user that it will be listening on port 3000. Which is why we will later use the '-p' flag when we run the container, to actually publish the port

```Dockerfile
CMD ["node", "server.js"]
```
- This defines the commands we want to run when the container starts. Since the command 'node server.js' successfully ran the server earlier, that's what we want to run when the container starts. Container starts, the server starts. 

https://docs.docker.com/build/concepts/dockerfile/

### Build the Docker image
```shell
build -t give-the-image-a-tag .
```
This will give us an image based on the Dockerfile in the current directory, specified with the '.'. The instructions in the Dockerfile will build the exact image we need. The '-t' flag is used to specify a tag name when building a Docker image. This tag name helps identify and the version of the image. Later, this tag can be used to start/stop/manage containers based on that image.

### Run the Docker Container
```shell
docker run -p 3000:3000 give-the-image-a-tag
```
This will run the container and map port 3000 of our container to port 3000 of the host machine.

### Verify the container is running
We can simply head over to http://localhost:3000 and we should see the JSON:
```JSON
{
  "message": "My name is Austin",
  "timestamp": 123456789
}
```

or alternatively you can run the command:

```shell
curl http://localhost:3000
```

We should expect this to return:

```JSON
{"message":"My name is Austin","timestamp":123456789}
```

https://docs.docker.com/reference/dockerfile/

https://www.reddit.com/r/docker/comments/x1gd5j/rationale_for_using_docker_to_containerize/

---

# GitHub Actions

---

# Cloud Deployment

---

# Deployment Workflow
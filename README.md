# Documentation for Liatrio take home assignment

---
![Deploy Badge](https://github.com/n0rq1/apprentice-assignment/actions/workflows/demo.yml/badge.svg)
---

# Table of Contents

- [Documentation for my take home assignment](#documentation-for-my-take-home-assignment)
  - [](#)
- [Table of Contents](#table-of-contents)
- [Node.js application](#nodejs-application)
    - [Node.js](#nodejs)
    - [Express.js](#expressjs)
    - [Steps to set up Node.js and Express.js app](#steps-to-set-up-nodejs-and-expressjs-app)
    - [Implement server](#implement-server)
    - [Run the server:](#run-the-server)
- [Containerizing the Application with Docker](#containerizing-the-application-with-docker)
    - [Why containerize our app?](#why-containerize-our-app)
    - [Docker](#docker)
    - [Node Image Variants](#node-image-variants)
    - [Make sure Docker is installed and make sure Docker daemon is running](#make-sure-docker-is-installed-and-make-sure-docker-daemon-is-running)
    - [Create Dockerfile](#create-dockerfile)
    - [Dockerfile Breakdown](#dockerfile-breakdown)
    - [Build the Docker image](#build-the-docker-image)
    - [Run the Docker Container](#run-the-docker-container)
    - [Verify the container is running](#verify-the-container-is-running)
- [GitHub Actions](#github-actions)
    - [What is GitHub Actions?](#what-is-github-actions)
    - [General Structure of GitHub Action Workflows](#general-structure-of-github-action-workflows)
    - [Prerequisites for OUR GitHub Action Workflow](#prerequisites-for-our-github-action-workflow)
    - [Creating our GitHub Action Workflow](#creating-our-github-action-workflow)
    - [Stucture of the workflow](#stucture-of-the-workflow)
    - [Breakdown of workflow.yml](#breakdown-of-workflowyml)
- [How to create the GCP\_CREDENTIALS secret:](#how-to-create-the-gcp_credentials-secret)
- [Cloud Deployment](#cloud-deployment)
    - [Google Cloud Run](#google-cloud-run)
    - [What do we need to deploy to Google Cloud Run](#what-do-we-need-to-deploy-to-google-cloud-run)
    - [How to create a Google Cloud Run service](#how-to-create-a-google-cloud-run-service)
- [References](#references)

---

# Node.js application

### Node.js
Node.js is a software platform for server-side and networking applications. Node.js contains a built-in, asynchronous I/O library for file, socket, and HTTP communication.

### Express.js
Express.js is a popular Node.js framework, used to build web apps and APIs. It is referred to as "minimalist", as it mainly serves the basic needs of a web app, such as: handling HTTP requests, routing, and middleware integration. Despite being minimalist, developers have created many compatible packages to make it even more flexible. 

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
*.js - I named mine index.js
```

### Implement server 
Add code to the index.js file:
```js
const express = require('express');
const app = express();
const PORT = 80;

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

- Start by importing the express module and store it as the const `express`
- Create an Express app and store it as the const `app`
- Next, we need to define the port we want to listen on. This port is 80, in order to pass the Liatrio tests
- Now, we need to define a route to listen to 'get' requests
    - The `app` variable comes with numerous methods: get, listen, post, put, delete, all, etc. but we want to have our app up and running so the data is retrievable. app.get is the most appropriate for this
    - app.get('/') means when we get 'get' requests to the root URL, we will respond accordingly
- We want to respond with a JSON with a message and a timestamp, so we will define an object and store it as 'response'. Finally, we will send a JSON response to the client using res.json(), which returns the object we defined earlier. Passing the variable 'response' into the function json() will send it as a properly formatted JSON to the client. 
- Finally we want to start our Express server and define what port we are listening on. This is achieved by app.listen(PORT,...). And every time we start the server, we just want to log that the server is up and running, and what port.

### Run the server:
```shell
node index.js
```

Should output to the console: 'Server is running on port xxxx' if done correctly :D

Now, the web app listens on the specified port, handles GET requests at /, and responds with a JSON object containing a message and a dynamic timestamp. 

---

# Containerizing the Application with Docker

### Why containerize our app?
Containerizing our app serves a handful of purposes. One being that each person will have a consistent environment. Instead of fixing environment issues per person/machine, you can focus on one setup that works across all systems and solves the "it works on my machine" problem. Docker is all about isolation and package dependency. 

### Docker
Docker is a platform that allows developers to build, share, and run container applications.  

### Node Image Variants
According to the Docker documentation there are 3 main versions of Node Docker images. Regular, Alpine, and Slim. Each with different use cases, but what they mainly refer to is the underlying OS/Linux distribution and the set of pre-installed system utilities. These versions are specified as suffixes after the version number e.g. Node:20-Alpine, or no suffix for regular image, just Node:version.

Regular
This is the recommended version if you don't know exactly what you need, it casts a pretty wide net. Based in Ubuntu or Debian, includes the full set of Linux utilities and libaries. This one seems to require the least amount of package management.

Alpine
If you're looking for the lightest image possible, go with this one. Based in Alpine Linux which is designed to be extremely minimalistic.

Slim 
From what I have read, this is the sweet spot between regular and Alpine. Based in Debian, but stripped down and removes most of the unnecessary tools.

### Make sure Docker is installed and make sure Docker daemon is running
```shell
docker info
```
Docker should be recognized as a command if installed. If Docker info successfully runs, the last line in the output will let you know if the Docker daemon is running. If you see: ERROR Cannot connect to the Docker daemon..., Docker daemon is not running, so you need to start it via a command or start the Docker desktop app. If you don't see the ERROR, you should be good to go!

### Create Dockerfile

Create the file Dockerfile, in the same directory your index.js, package.json, and package-lock.json are in.

```Dockerfile
FROM node:16-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 80

CMD ["node", "index.js"]
```

### Dockerfile Breakdown

```Dockerfile
FROM node:16-alpine
```
- The first thing we need at the top of our Dockerfile is the base for our image
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
EXPOSE 80
```
- This exposes a port to the host machine. This tells Docker that the container will listen on port 80. From my understanding this is more like documentation for the user that it will be listening on port 80. Which is why we will later use the '-p' flag when we run the container, to actually publish the port

```Dockerfile
CMD ["node", "index.js"]
```
- This defines the commands we want to run when the container starts. Since the command 'node index.js' successfully ran the server earlier, that's what we want to run when the container starts. Container starts, the server starts. 

### Build the Docker image
```shell
build -t give-the-image-a-tag .
```
This will give us an image based on the Dockerfile in the current directory, specified with the '.'. The instructions in the Dockerfile will build the exact image we need. The '-t' flag is used to specify a tag name when building a Docker image. This tag name helps identify and the version of the image. Later, this tag can be used to start/stop/manage containers based on that image.

### Run the Docker Container
```shell
docker run -d -p 80:80 give-the-image-a-tag
```
This will run the container and map port 80 of our container to port 80 of the host machine.

### Verify the container is running
We can simply head over to http://localhost:80 and we should see the JSON:
```JSON
{"message":"My name is Austin","timestamp":123456789}
```

or alternatively you can run the command:

```shell
curl http://localhost:80
```

We should expect this to return:

```JSON
{"message":"My name is Austin","timestamp":123456789}
```

---

# GitHub Actions

### What is GitHub Actions?

From the GitHub documentation: Automate, customize, and execute your software development workflows right in your repository with GitHub Actions. You can discover, create, and share actions to perform any job you'd like, including CI/CD, and combine actions in a completely customized workflow. In the scope of this exercise, we want to utilize GitHub actions to: build, test, push, and deploy. In the scope of this GitHub Action Workflow, whenever a push is made to the `main` branch, we need to run a sequence of jobs. These jobs are run sequentially, from top-down.

### General Structure of GitHub Action Workflows
At the top of every GitHub Action Workflow, there should be a name. For example: `name: Amazing GHA Workflow`. The name generally should be some indicator of what the workflow's purpose is.

Next should be the keyword `on`, which specifies the event that triggers the workflow. The 3 main event are triggers: `push`, `pull_request`, & `workflow_dispatch`. Once the event trigger is defined, then you must define what branches you want the workflow to run on. An example of these in its entirety is: 
```yaml
on:
  push:
    branches:
      - main
```
This will run the workflow whenever there is a push to main!

Once we have determined when to run the workflow, we need to define jobs. Jobs, as mentioned earlier, are executed in sequence and should each achieve a specific goal. Jobs are defined using the `jobs` keyword, and each job runs in its own virtual machine. Each job must be given a name, and the steps within each job are indented accordingly. The steps are defined with the keyword... `steps`. This is pretty open ended as each job requires different steps, so it's best explained through an example:
```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v2
      - name: Run tests
        run: npm test
```
This example shows us running a job named `test` that runs on Ubunu-latest virtual environment. There are 2 steps to our job. First, we want to checkout the code from our repository. Using the `uses` keyword, we are going to invoke the already existing action 'checkout@v2'. This fetches the code from our repository and makes it available to the VM. Once that is complete, we will run the second step called 'Run tests', where we are going to run the command `npm test` on the VM. 

### Prerequisites for OUR GitHub Action Workflow
- Docker Hub account (Remember username/password)
- Create repository secrets for your Docker hub username and password and our GCP Credentials
- File called .releaserc.json in the root of the repository

How to create secrets for your repository:
- Go to your repository's settings
- Look for secrets and variables under the security section
- Select the "actions" option in the dropdown
- Create a new repository secret and name it DOCKER_USERNAME and put your Docker Hub username as the value or secret
- Create another repository secret and name it DOCKER_PASSWORD and put your Docker Hub password as the value or secret
- Create another reposiotry secret and name it GCP_CREDENTIALS and put the JSON object in it (that is shown in the next section)

**.releaserc.json**
```json
{
    "branches": ["main"],
    "plugins": [
      "@semantic-release/commit-analyzer",
      "@semantic-release/release-notes-generator",
      "@semantic-release/github"
    ]
}
```
Explanation: This configuration is for Semantic Release, which automates versioning and release management. It triggers on the "main" branch and uses three plugins: commit-analyzer (to determine the type of version update based on commit messages), release-notes-generator (to create release notes from commit messages), and github (to publish the release to GitHub).

### Creating our GitHub Action Workflow

Create the directory, if it doesn't already exist (from the root of the project)
```shell
mkdir .github/workflows
```

Create the workflow file, name it anything *.yml or *.yaml
```shell
touch workflow.yml
```

**workflow.yml**
```yaml
name: Workflow for Liatrio Take Home Assignment 

on:
  push:
    branches: ["main"]

jobs: 
  run-test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Build Docker image
        run: docker build -t liatrio .

      - name: Run Docker container
        run: docker run -d -p 80:80 liatrio

      - name: Run Liatrio tests
        uses: liatrio/github-actions/apprentice-action@v1.0.0

  create-release-version:
    runs-on: ubuntu-latest
    needs: run-test
    outputs:
      version: ${{ steps.version.outputs.VERSION }}

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Semantic Release
        id: semantic
        uses: cycjimmy/semantic-release-action@v4
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

      - name: Save version for Docker tag
        id: version
        run: echo "VERSION=${{ steps.semantic.outputs.new_release_version }}" >> $GITHUB_OUTPUT

  push-image:
    runs-on: ubuntu-latest
    needs: create-release-version
    outputs:
      version: ${{ needs.create-release-version.outputs.version }}
       
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Build Docker image
        run: docker build -t liatrio .

      - name: Log in to Docker Hub
        run: echo ${{ secrets.DOCKER_PASSWORD }} | docker login --username ${{ secrets.DOCKER_USERNAME }} --password-stdin

      - name: Push Docker image to Docker Hub
        env:
          VERSION: ${{ needs.create-release-version.outputs.version }}
        run: |
          docker tag liatrio ${{ secrets.DOCKER_USERNAME }}/liatrio:$VERSION
          docker push ${{ secrets.DOCKER_USERNAME }}/liatrio:$VERSION

  deploy:
    runs-on: ubuntu-latest
    needs: push-image

    steps:
      - name: Google Auth
        uses: 'google-github-actions/auth@v2'
        with:
          credentials_json: '${{ secrets.GCP_CREDENTIALS }}'

      - name: Deploy to Cloud Run
        id: deploy
        uses: 'google-github-actions/deploy-cloudrun@v2'
        with:
          service: 'liatrio'
          region: us-west1
          image: 'docker.io/${{ secrets.DOCKER_USERNAME }}/liatrio:${{ needs.push-image.outputs.version }}'

      - name: 'Use output'
        run: 'curl "${{ steps.deploy.outputs.url }}"'
```

### Stucture of the workflow
The workflow's intent is ultimately to deploy a Docker container to Google Cloud Run. However, there are a few necessary steps to ensure the integrity of the app. The goal of this workflow is to:
- Make sure the app's minimum functionality is met. - Defined by the Liatrio tests
- Create a **Semantic Version** for the app, ensuring that it follows proper versioning rules.
- Push our image to Docker Hub
- Deploy the container to Google Cloud Run

These steps are broken up into 4 jobs within the workflow: `run-test`, `push-image`, `push-image`, `deploy`.

### Breakdown of workflow.yml
```yaml
name: Workflow for Liatrio Take Home Assignment  
```
We simply just need to create a name for our workflow. So just name it something useful or related to the workflow

```yaml
on:
  push:
    branches: ["main"]
```
`on` means do this workflow if... In this case we want to trigger the workflow when there is a push to the branch `main`. If this didn't exist, the workflow would never trigger.

**run-test**
```yaml
jobs: 
  run-test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Build Docker image
        run: docker build -t liatrio .

      - name: Run Docker container
        run: docker run -d -p 80:80 liatrio

      - name: Run Liatrio tests
        uses: liatrio/github-actions/apprentice-action@v1.0.0
```
The first job in our workflow is designed to test our Docker image. The Liatrio tests are designed to verify the functionality of our application (index.js). There are 6 tests that test the following:
- A 200 status code is returned
- A JSON object is returned with a Message
- A JSON object is returned with a timestamp
- The message says: "My name is ..."
- The timestamp is UNIX style 
- The timestamp is within a few seconds of the current time of testing

The `run-test` job first uses `actions/checkout@v4` to fetch the code from the repository and make it available to the VM, running on Ubuntu-latest. Now that everything is available, we will build the image and run the container. With the container running, we can run the Liatrio tests that were previously described. This ensures the functionality of our app.

**create-release-version**
```yaml
  create-release-version:
    runs-on: ubuntu-latest
    needs: run-test
    outputs:
      version: ${{ steps.version.outputs.VERSION }}

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Semantic Release
        id: semantic
        uses: cycjimmy/semantic-release-action@v4
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

      - name: Save version for Docker tag
        id: get_version
        run: echo "VERSION=${{ steps.semantic.outputs.new_release_version }}" >> $GITHUB_OUTPUT
```
This job is dependent on the `run-test` job. If the tests did not pass 6/6, then we should not carry on with this job. This is why we have to have the `needs` keyword. Meaning we need the `run-test` job to have completed successfully in order to run the `create-release-version` job. Additionally information isn't passed from job to job automatically. However, you can create output for your job, that can be accessed in the next job! For this, we need the `outputs` keyword, where we essentially define a variable we want to output. In this case, I chose version to be the name of the variable passed to the next job. 

`version: ${{ steps.version.outputs.VERSION }}` means we are assigning **version** to be the output of the step **get_version**, which will be explained why we need it in a few sections from now. 

```yaml
- name: Semantic Release
  id: semantic
  uses: cycjimmy/semantic-release-action@v4
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```
Here, we are invoking the already existing GitHub Action that automates Semantic Release for our workflow. Depending on the commit message, the version of our app will auto update. The structure of each version is: **Major**.**Minor**.**Patch**.
- **Patch Version (`x.y.Z`)** – Incremented for bug fixes:  
  - Example: `fix: Timestamp formatting fixed`  

- **Minor Version (`x.Y.0`)** – Incremented for new features:  
  - Example: `feat: Added new field to JSON`  

- **Major Version (`X.0.0`)** – Incremented for breaking changes:  
  - Example:  
    ```  
    feat: Changed API Endpoint  

    BREAKING CHANGE: More info...  
    ```  

Additionally in this step, we use the keyword `env` which identifies environmental variables. In this case, we are storing an environmental variable called **GITHUB_TOKEN**, where it contains the value secrets.GITHUB_TOKEN. This secret wasn't set by us, so where did it come from? GitHub automatically creates the secret GITHUB_TOKEN when a workflow runs. This is used to authenticate API requests, and is only active while the workflow runs. If we don't set GITHUB_TOKEN, we won't be able to create a new semantic release version :D.

```yaml
- name: Save version for Docker tag
  id: get_version
  run: echo "VERSION=${{ steps.semantic.outputs.new_release_version }}" >> $GITHUB_OUTPUT
```
The last step, is where we need to output the version, so we can pass it to the next job. I like to think of this as a return statement. It outputs the new release version to standard output and appends it to the **GITHUB_OUTPUT** environment variable. 

**push-image**
```yaml
  push-image:
    runs-on: ubuntu-latest
    needs: create-release-version
    outputs:
      version: ${{ needs.create-release-version.outputs.version }}
       
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Build Docker image
        run: docker build -t liatrio .

      - name: Log in to Docker Hub
        run: echo ${{ secrets.DOCKER_PASSWORD }} | docker login --username ${{ secrets.DOCKER_USERNAME }} --password-stdin

      - name: Push Docker image to Docker Hub
        env:
          VERSION: ${{ needs.create-release-version.outputs.version }}
        run: |
          docker tag liatrio ${{ secrets.DOCKER_USERNAME }}/liatrio:$VERSION
          docker push ${{ secrets.DOCKER_USERNAME }}/liatrio:$VERSION
```
This job is extremely simple, we are just going to use our VM to build an image and push the image to Docker Hub. The tag will be the new semantic release version. Nothing else, besides that we need to output the version once again to use in the next job.

**deploy**
```yaml
  deploy:
    runs-on: ubuntu-latest
    needs: push-image

    steps:
      - name: Google Auth
        uses: 'google-github-actions/auth@v2'
        with:
          credentials_json: '${{ secrets.GCP_CREDENTIALS }}'

      - name: Deploy to Cloud Run
        id: deploy
        uses: 'google-github-actions/deploy-cloudrun@v2'
        with:
          service: 'liatrio'
          region: us-west1
          image: 'docker.io/${{ secrets.DOCKER_USERNAME }}/liatrio:${{ needs.push-image.outputs.version }}'

      - name: 'Use output'
        run: 'curl "${{ steps.deploy.outputs.url }}"'
```
The last job of our workflow will be to redeploy our service with the updated image. Since in the previous job, we create a new image, where the tag was the new semantic release version, we need to update our image that GCR is pulling from. Before doing that, we need to authenticate ourselves. If we don't authenticate, we won't have access to our GCR service, which is a good thing! We authenticate ourselves by using the Google Auth GitHub action. Here, we just need to pass it our credentials secret. 

# How to create the GCP_CREDENTIALS secret:
- Go to your project on Google Cloud
- Go to the navigation menu in the top left
- In the nav menu, go to 'I AM & Admin'
  - Select 'Service Accounts'
- There should just be one service account by default, but if you don't see one, just make one
- Select the service account
  - Go to 'keys'
  - Click 'Add a key' and 'create a new key'
  - Select the JSON option
- Once that is completed a JSON file will be downloaded
  - Copy the contents of the JSON file and you're going to set this as the value of your new secret
- Go to your GH repository's settings and create a new secret called 'GCP_CREDENTIALS'
  - Paste the contents of your JSON file into the value of the secret

Now that we are authenticated, we can start modifying the service!

Simply use the Cloud Run GitHub Action and update your service accordingly. In this case my service is called **Liatrio**. So I will update the image for my Liatrio service and also include the region to specify my service even more! By default, if you don't include region, it will default to US-Central and create a new service called 'Liatrio' based in the US-Central region. 

The last step is simply for debugging our deployment :D

---

# Cloud Deployment
### Google Cloud Run
I chose Google Cloud Run for deployment because, in my research, I found that the container-as-a-service (CaaS) model provides the best balance of scalability, cost efficiency, and ease of management. Cloud Run allows me to deploy my microservice as a stateless container without worrying about underlying infrastructure, making it a great fit for my project. Cloud Run offers a free tier as well, which was a major bonus. The other service I considered, was AWS ECS, which offers essentially the same service, but opted to use Cloud Run because I have used GCP before.

### What do we need to deploy to Google Cloud Run
What Google Cloud will do, is pull our Docker image from our Docker Hub repository and run the container for us. Nothing else needs to be done :D

### How to create a Google Cloud Run service
Google Cloud Run just needs us to do a few things:
- Create a project and name it whatever you want
- Click "deploy container" 
  - In the dropdown select "service"
- Define where we want our service to pull the image from in the container url 
  - This will be updated each time our GHA workflow runs. But set it initially to any version of the image we want
- Name the service what ever you want, just remember it and make sure it matches what's in the GHA workflow
- Pick any region, again just make sure it match the GHA workflow region
- Now just select a few option, and leave everything else the same/default:
  - Authentication, select the "Allow unauthenticated invocations" option
  - Set minimum number of instance to 1
    - This prevents cold starts
- Go to "Container(s), volumes, networking, security
  - Set the container port to 80
- Press create!

---

# References

**Node.js Application**

- https://www.w3schools.com/nodejs/nodejs_intro.asp
- https://expressjs.com/en/starter/faq.html
- https://www.youtube.com/watch?v=SccSCuHhOw0
- https://github.com/expressjs/express
- https://www.json.org/json-en.html


**Containerizing the Application with Docker**

- https://hub.docker.com/_/node 
- http://hub.docker.com/_/docker
- https://github.com/nodejs/docker-node/blob/main/README.md#how-to-use-this-image
- https://www.youtube.com/watch?v=cw34KMPSt4k
- https://www.youtube.com/watch?v=gAkwW2tuIqE
- https://docs.docker.com/reference/dockerfile/
- https://www.reddit.com/r/docker/comments/x1gd5j/rationale_for_using_docker_to_containerize/

**GitHub Actions** 

- https://github.com/actions/checkout
- https://docs.github.com/en/actions/security-for-github-actions/security-guides/using-secrets-in-github-actions
- https://github.com/liatrio/github-actions/tree/v1.0.0/apprentice-action
- https://github.com/cycjimmy/semantic-release-action/tree/v4/
- https://docs.github.com/en/actions/writing-workflows

**Cloud Deployment**

- https://cloud.google.com/run?hl=en
- http://youtube.com/watch?v=AL2rAmWFZjM
- https://www.youtube.com/watch?v=3OP-q55hOUI

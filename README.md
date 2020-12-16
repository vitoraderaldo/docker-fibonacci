# Fibonacci Calculator

This project is about to develop a web interface to calculate the Fibonacci of a given index. This project aimed to learn Docker and understand how containers work and interact. For this, we complicated a little bit the complexity.

### Installation
1. This project requires Docker and Docker Compose
2. Clone this repository and run the following commands:
    ```sh
    $ cd docker-fibonacci
    $ docker-compose up --build
    ```
3. Now you can access the application on localhost:9999

### Technologies
The following technologies were used to create this application:
* NodeJS, React, and Nginx
* Redis and Postgres
* Amazon ElasticBeanstalk, Relational Database Service and ElastiCache
* Docker and Docker Compose
* Travis CI

### Architecture
You can get more detail by looking at the diagram:
![Dev Architecture](/.documents/dev-architecture.png "Dev Architecture")

As you can see six services are running in different containers. However, in production, this number goes down to four, because the Postgres container is replaced by Amazon Relational Database Service, and the Redis container is replaced by ElastiCache.

Also, the Frontend Application is being delivered by the React Server only when running locally. However, in production, the Frontend Application replaces React Server with Nginx. 

Why do we need to replace it?
Because the React Server takes more CPU utilization due to allowing the application to be automatically restarted when the code changes. We don't need this in production.

### Continuous Integration Flow
Travis CI is responsible to automate the deployment. 
So every time a commit is created on branch master, Travis will do the following:

1. Get the code
2. Set up a docker environment
3. Build a docker image to test the application
4. Run the test suit based on the image created above
5. Build production docker images of each service and push them into Docker Hub
6. Deploy this service into AWS using ElasticBeanstalk

### Folder Structure

Here is the way the folders are organized:

| Folder | Description |
| ------ | ------ |
| client | Code of the react web application |
| nginx | Configuration of the Nginx router |
| server | Code of the NodeJS application that will handle the client application requests |
| worker | Code of the NodeJS application that will calculate the Fibonacci value  |

If you take a look at the code or the architecture you can see that there are two Nginx servers. 
* The first one is inside the client folder, it's used to serve the HTML/JS files, however, this Nginx server will not be the one that the user will use directly.
* The second is inside the Nginx folder, that's the one the user will access. The purpose of this Nginx server is to route the requests to the client and the server.

### Configuration files
Here are the configuration files that make it possible to build, push, and deploy containers:
| File | Description |
| ------ | ------ |
| .travis.yml | Travis CI configuration. Used to tell Travis how the deployment must flow |
| docker-compose.yml | Docker Compose configuration. Used to run multi-container locally |
| Dockerrun.aws.json| ElasticBeanstalk configuration. Used to tell AWS how the containers must be deployed |

### Source
This project was based on the following Udemy Course: 
* [Docker and Kubernetes: The Complete Guide](https://www.udemy.com/course/docker-and-kubernetes-the-complete-guide)

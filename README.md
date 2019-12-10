# Orchestrator


The project is focused on building a container orchestrator that can perform load balancing,
fault tolerance, and auto-scaling within the EC2 instances. 
 
This is a social media application built to upload selfless acts, attribute the
act to a category and view other acts on the server. The server can be queried using
REST-API calls.

On the server side of the code, there must exist containers that return user related
queries and containers that handle act related requests.

As part of this project, we create a generic orchestrator which can be used to
manage multiple containers that cater to the same requests. All containers will run
the same docker image.

This orchestrator implements the following features:

● Manage Containers - Orchestrator manages all the containers. It functions both as
an implementation of functions and as an interface to start and stop containers.

● Load Balancing - Orchestrator manages N number of containers at any particular
point in time. All requests for containers of a certain image will be made to the
orchestrator. The orchestrator forwards the requests to any of the available
containers in a round-robin fashion. This ensures that requests are spread out
equally amongst all the running containers.

● Auto-Scaling - The volume of requests per unit time changes the number of running
containers. If there are a large number of requests flowing into the orchestrator, the
orchestrator must respond by increasing the number of containers. Similarly, a
decrease in the number of requests will result in a reduction in the number of
containers.

● Monitor Containers - At any time, a container could be found to be unhealthy and
must be stopped and restarted. It is the job of the orchestrator to periodically check
for the healthiness of all running containers. On finding an unhealthy container, it
must eliminate that container and set up a new container in its place.


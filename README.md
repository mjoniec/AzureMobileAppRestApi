# Possible Setups:

- localhost On Premises Ui + localhost On Premises Mock Api
- localhost On Premises Ui + localhost On Premises Microservices - ps script
- localhost On Premises Ui + localhost Dockerised Microservices - compose file
- Azure On Premises Ui + Azure On Premises Mock Api
- Azure On Premises Ui + Azure Dockerised Microservices


# Run - On Premises

- dotnet run --color=#888111 - run service with parameters
- https://localhost:44389/api/AirTrafficInfo
- http://localhost:4200/pages/maps/bubble

# Run - Docker Compose 

- docker-compose up
- docker-compose up --build --force-recreate --no-deps
- docker-compose down
- http://localhost:8880/api/AirTrafficInfo

# Docker 

status check

- docker -v
- docker ps - lists running containers
- docker ps --all - not always shows what expected
- docker image list
- docker image ls
- docker container ls -a (works best)
- docker container list -all
- docker inspect -f "{{ .NetworkSettings.Networks.nat.IPAddress }}" metalsprices_test1

build

- docker build -t image_name . 

run

- docker run -d -p 8080:80 --name container_name image_name
- docker run -d -p 8081:81 --name plane_1 plane
- docker run -d -p 8082:82 --name plane_2 plane

-d: This is short for detach and means that the Docker container will run in the background. We won’t be seeing any output from the application that’s running inside the container. If we want to see that output, we can use:
docker logs container_name

cleanup

- docker stop 1111_container_id
- docker container rm 1111_container_id
- docker rmi 2222_image_id
- docker rm 1111_container_id
- docker stop 1111_container_id
- docker container prune -f (remove all containers, not asking for confirmation)
- docker-compose down - stops and removes containers

## compose info

  --force-recreate    Recreate containers even if their configuration
                      and image haven't changed.
                      
  --build             Build images before starting containers.
  
  --no-deps           Don't start linked services.

- alternate restart:

    stop docker compose: $ docker-compose down

    remove the container: $ docker system prune -a

    start docker compose: $ docker-compose up -d

docker system prune -a will delete all images, even ones for other projects. It's recommended against the usage of this.

## hub

- docker login -u "user" -p "password" docker.io
- docker push mjdocker31/test2api
- https://hub.docker.com/repository/docker/mjdocker31



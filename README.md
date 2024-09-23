# Client Gateway

This is the client gateway for the project. It is responsible for handling all the client requests and sending them to the appropriate microservice.

## Dev

1. Clone the repository
2. Run `npm install`
3. Create .env from .env.example
4. Getting up Nats server
5. Getting microservices up and running (Refer to the README.md of each microservice)
6. Run `npm run start:dev`

## Nats

```bash
docker run -d --name nats-main -p 4222:4222 -p 6222:6222 -p 8222:8222 nats
```

## Production

build docker image

```bash
docker build -f Dockerfile.prod -t client-gateway .
```

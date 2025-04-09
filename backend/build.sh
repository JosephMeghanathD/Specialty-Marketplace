#!/bin/sh

cd ./userservice || exit
./gradlew clean build publish
cd ..


cd ./productorderservice || exit
./gradlew clean build
cd ..


docker-compose down --rmi all --volumes --remove-orphans user-service product-service
docker-compose build
docker-compose up -d

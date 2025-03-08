#!/bin/bash
docker rmi ghcr.io/aunchagaonkar/inspect:latest &>/dev/null
# force delete containers
docker rm -f the metamorphosis DockerVerse &>/dev/null
# force delete network
docker network rm jio &>/dev/null

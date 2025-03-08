#!/bin/bash
docker run -it --network ctf_network --rm -v /var/run/docker.sock:/var/run/docker.sock ghcr.io/yash09042004/attacker_image:9
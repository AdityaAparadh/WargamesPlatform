#!/bin/bash
docker run -it --rm --network ctf_network --name attacker_container -v /var/run/docker.sock:/var/run/docker.sock yashkiran2004/attacker_image:2 /bin/bash

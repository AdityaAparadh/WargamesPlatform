#!/bin/bash

SERVICES=(wow_service cool_service smart_service csd_service pro_hacker leet_skills noob_detector foolish_service haha_no_flag wrong_turn keep_looking)

function cleanup {
    echo "Cleaning up..."
    for SERVICE in "${SERVICES[@]}"; do
        docker rm -f "$SERVICE" 2>/dev/null
    docker rmi "$SERVICE" 2>/dev/null
    done
    docker network rm ctf_network 2>/dev/null
}
trap cleanup EXIT
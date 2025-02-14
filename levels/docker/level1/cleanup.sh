#!/bin/bash
echo "Cleaning up..."
for SERVICE in "${SERVICES[@]}"; do
    docker rm -f "$SERVICE" 2>/dev/null
done
docker network rm ctf_network 2>/dev/n
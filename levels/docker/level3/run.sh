    docker run -it \
      -v /var/run/docker.sock:/var/run/docker.sock \
      -v $(which docker):/usr/bin/docker \
      -v /var/lib/docker/volumes:/var/lib/docker/volumes \
      --name Meta_Level_3 \
      ghcr.io/pranavg1203/meta:warg02 bash

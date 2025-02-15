#!/bin/bash

# Step 1: Create a Docker network
docker network create ctf_network 2>/dev/null || echo "Network already exists"

# Step 2: Pre-build a base image to avoid redundant installations
docker build -t ctf_base - <<EOF
FROM python:3.9-alpine
RUN pip install flask
RUN mkdir -p /opt/hidden
EOF

# Step 3: Function to create service containers
create_service_container() {
    local SERVICE_NAME=$1
    local HAS_FLAG=$2

    mkdir -p "$SERVICE_NAME"
    cat <<EOF > "$SERVICE_NAME/Dockerfile"
FROM ctf_base
EOF

    if [[ "$HAS_FLAG" == "true" ]]; then
        cat <<EOF >> "$SERVICE_NAME/Dockerfile"
COPY flag.py /opt/hidden/flag.py
CMD ["python3", "/opt/hidden/flag.py"]
EOF
    else
        cat <<EOF >> "$SERVICE_NAME/Dockerfile"
COPY roast.py /opt/hidden/roast.py
CMD ["python3", "/opt/hidden/roast.py"]
EOF
    fi

    if [[ "$HAS_FLAG" == "true" ]]; then
        cat <<EOF > "$SERVICE_NAME/flag.py"
from flask import Flask
app = Flask(__name__)

@app.route("/")
def home():
    return "Service is running!"

@app.route("/flag")
def flag():
    return "FLAG ==> 3571802c2987b4efd911803b3b52975044a5927ca127cc1fc07ee4c146f0e0e9"

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
EOF
    fi

    cat <<EOF > "$SERVICE_NAME/roast.py"
from flask import Flask
import random

app = Flask(__name__)

roasts = [
    "Wow, nice try! Maybe try using your brain this time?",
    "You are one command away from finding the flag... if only you knew which one.",
    "Bro, you just curled the wrong container. Try again, genius.",
    "404: Flag not found. But your stupidity is confirmed.",
    "If finding the flag was as easy as failing, you’d be a champion.",
    "You really thought it would be that easy? LOL.",
    "Your approach is like a broken clock—wrong 24/7.",
    "No flag here, but congrats on wasting 10 seconds of your life.",
    "Your logic is so flawed, even a calculator would reject it.",
    "Hacking skills = 0.0. Try harder!"
]

@app.route("/")
def home():
    return "This is a totally normal service."

@app.route("/flag")
def fake_flag():
    return random.choice(roasts)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
EOF

    docker build -t "$SERVICE_NAME" "$SERVICE_NAME" && rm -rf "$SERVICE_NAME"
}

# Step 4: Build all service containers
create_service_container "wow_service" "true"
create_service_container "cool_service" "false"
create_service_container "smart_service" "false"
create_service_container "csd_service" "false"
create_service_container "pro_hacker" "false"
create_service_container "leet_skills" "false"
create_service_container "noob_detector" "false"
create_service_container "foolish_service" "false"
create_service_container "haha_no_flag" "false"
create_service_container "wrong_turn" "false"
create_service_container "keep_looking" "false"

# Step 5: Create stopped service containers
echo "Creating stopped service containers..."
SERVICES=(wow_service cool_service smart_service csd_service pro_hacker leet_skills noob_detector foolish_service haha_no_flag wrong_turn keep_looking)

for SERVICE in "${SERVICES[@]}"; do
    docker create --name "$SERVICE" --network ctf_network "$SERVICE" || echo "Failed to create $SERVICE"
done

echo "All service containers have been created in a stopped state."
echo "Participants must start them manually using:"
echo "docker start <container_name>"

# Step 6: Verify creation
echo "Verifying created containers..."
docker ps -a

# Step 7: Run Attacker Container
docker pull yashkiran2004/attacker_image:2

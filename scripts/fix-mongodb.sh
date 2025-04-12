#!/bin/bash

echo "Fixing MongoDB setup..."

# Stop MongoDB service
sudo systemctl stop mongod

# Fix permissions
sudo chown -R mongodb:mongodb /var/lib/mongodb
sudo chown -R mongodb:mongodb /var/log/mongodb
sudo chmod 750 /var/lib/mongodb
sudo chmod 750 /var/log/mongodb

# Clear lock files if they exist
sudo rm -f /var/lib/mongodb/mongod.lock
sudo rm -f /tmp/mongodb-27017.sock

# Start MongoDB service
sudo systemctl start mongod
sudo systemctl status mongod

# Enable MongoDB to start on boot
sudo systemctl enable mongod

echo "MongoDB setup fixed. Check status above."

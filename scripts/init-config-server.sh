#!/bin/bash

mongod --configsvr --replSet configReplSet --bind_ip_all --port 27017 &
sleep 10
# Initialiser le replica set du serveur de configuration
mongosh --eval 'rs.initiate({_id: "configReplSet", configsvr: true, members: [{ _id: 0, host: "configsvr1:27017" }, { _id: 1, host: "configsvr2:27017" }, { _id: 2, host: "configsvr3:27017" }]})'

# Garder le conteneur en cours d'exécution
tail -f /dev/null
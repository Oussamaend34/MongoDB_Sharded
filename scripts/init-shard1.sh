#!/bin/bash

mongod --shardsvr --replSet shardReplSet1 --bind_ip_all --port 27017 &
sleep 10
# Initialiser le replica set du shard1
mongosh --eval 'rs.initiate({_id: "shardReplSet1", members: [{ _id: 0, host: "shard1a:27017" }, { _id: 1, host: "shard1b:27017" }]})'

# Garder le conteneur en cours d'exécution
tail -f /dev/null
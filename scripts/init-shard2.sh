#!/bin/bash

mongod --shardsvr --replSet shardReplSet2 --bind_ip_all --port 27017 &
sleep 10
# Initialiser le replica set du shard2
mongosh --eval 'rs.initiate({_id: "shardReplSet2", members: [{ _id: 0, host: "shard2a:27017" }, { _id: 1, host: "shard2b:27017" }, { _id: 2, host: "shard2c:27017" }]})'

# Garder le conteneur en cours d'exécution
tail -f /dev/null
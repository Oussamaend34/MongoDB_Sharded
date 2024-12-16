#!/bin/bash
mongos --configdb configReplSet/configsvr1:27017,configsvr2:27017 --bind_ip_all --port 27017 &
sleep 30

# Ajouter les shards au routeur
mongosh --eval 'sh.addShard("shardReplSet1/shard1a:27017,shard1b:27017")'
mongosh --eval 'sh.addShard("shardReplSet2/shard2a:27017,shard2b:27017")'

#Creation de la base de données 
mongosh --eval 'use reddit_data'
mongosh --eval 'sh.enableSharding("reddit_data")'

#Creation des collections
mongosh --eval 'sh.createCollection("posts")'
mongosh --eval 'sh.createCollection("comments")'


#Sharder les collections
mongosh --eval 'sh.shardCollection("reddit_data.posts", { "post_id": "hashed" })'
mongosh --eval 'sh.shardCollection("reddit_data.comments", { "comment_id": "hashed" })'


#Creation des index
mongosh --eval 'db.posts.createIndex({ post_id: 1},{ unique: true })'
mongosh --eval 'db.posts.createIndex({title: "text"})'
mongosh --eval 'db.comments.createIndex({ comment_id: 1 }, { unique: true });'


# Garder le conteneur en cours d'exécution
tail -f /dev/null
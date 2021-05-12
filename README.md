
Local development:

```
docker run --name mongo --rm -e MONGO_INITDB_ROOT_USERNAME=dbuser -e MONGO_INITDB_ROOT_PASSWORD=dbpassword -e MONGO_INITDB_DATABASE=counter -d -p 27017:27017 mongo
export DBUSER=dbuser
export DBPASSWORD=dbpassword
export DBNAME=counter
export DBHOST=127.0.0.1
```
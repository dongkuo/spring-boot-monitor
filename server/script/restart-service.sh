#!/usr/bin/env bash

service_name=$1

if [[ -f "/home/poitech/work/$1/$1-3.0.0-SNAPSHOT.jar.new" ]];then
  mv /home/poitech/work/${service_name}/${service_name}-3.0.0-SNAPSHOT.jar.new /home/poitech/work/${service_name}/${service_name}-3.0.0-SNAPSHOT.jar
fi
cd /home/poitech/ops && docker-compose restart ${service_name}
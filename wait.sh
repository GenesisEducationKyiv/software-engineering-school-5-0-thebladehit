#!/bin/bash

HOST="localhost"
PORT="3010"
RETRY_LIMIT=30
RETRY_INTERVAL=2


for ((i=1;i<=RETRY_LIMIT;i++)); do
  if curl http://$HOST:$PORT/health; then
    echo "Server ready"
    exit 0
  fi
    echo "Waiting for server..."
  sleep $RETRY_INTERVAL
done

exit 1

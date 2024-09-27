#!/bin/bash
for i in {1..100}
do
   curl -s http://localhost:3000/api/rate-limit & 
done
wait

# curl -s "http://localhost:3000/api/rate-limit" -H "Connection: keep-alive" -w "\n" -Z --parallel --parallel-max 100

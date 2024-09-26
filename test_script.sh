#!/bin/bash
for i in {1..100}
do
   curl -s http://localhost:3000/api/rate-limit & 
done
wait

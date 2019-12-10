#!/bin/bash
sudo docker run --name acts"$1" --network dockercont2_default -p 800"$1":80 -d 09e1ef77cc9d

#!/bin/bash
export SSHPASS='1Adbb67/8900'
if [ -z "$1" ]; then
    sshpass -e ssh -o StrictHostKeyChecking=no hellwired@wavesystem.online
else
    sshpass -e ssh -o StrictHostKeyChecking=no hellwired@wavesystem.online "$@"
fi

#!/bin/bash
export SSHPASS='1Adbb67/8900'
# Kill existing tunnel on 3307 if any
fuser -k 3307/tcp 2>/dev/null
# Start new tunnel
sshpass -e ssh -o StrictHostKeyChecking=no -f -N -L 3307:127.0.0.1:3306 hellwired@wavesystem.online
echo "Tunnel started on port 3307"

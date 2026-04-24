#!/bin/bash
set -a
source /home/work/.openclaw/workspace/retbaa-circle/.env.server
set +a
exec node /home/work/.openclaw/workspace/retbaa-circle/server/admin.js

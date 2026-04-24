#!/bin/bash
cd /home/work/.openclaw/workspace/retbaa-circle
export WEBHOOK_SECRET=retbaa-webhook-2026
node server/webhook.js

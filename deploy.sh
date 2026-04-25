#!/bin/bash
# deploy.sh — Script de déploiement Retbaa Circle
# Usage: ./deploy.sh

set -e

cd /home/work/.openclaw/workspace/retbaa-circle

echo "🔨 Build..."
npm run build

echo "🧹 Nettoyage du dossier de prod..."
sudo rm -rf /var/www/retbaa-circle/*

echo "📦 Copie des fichiers..."
sudo cp -r dist/* /var/www/retbaa-circle/
sudo cp -r public/docs /var/www/retbaa-circle/

echo "✅ Déployé — $(date '+%Y-%m-%d %H:%M')"

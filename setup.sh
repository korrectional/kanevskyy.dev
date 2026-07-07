npm ci
npm run build
sudo mkdir -p /var/www/kanevskyy.dev
sudo rsync -av --delete dist/ /var/www/kanevskyy.dev/
sudo nginx -t
sudo systemctl reload nginx
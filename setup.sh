export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
npm ci
npm run build
sudo mkdir -p /var/www/kanevskyy.dev
sudo rsync -av --delete dist/ /var/www/kanevskyy.dev/
sudo nginx -t
sudo systemctl reload nginx
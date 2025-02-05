set -e
set -x

cd $(dirname $0)
cd ../../public

cp -rf ../chiikawa-timer/dist/assets/ ./assets
cp -rf ../chiikawa-timer/dist/index.html ./index.html

git add .
git commit -m "auto-deploy"
git push

ssh kos << EOF
 cd /var/www/chiikawatimer.com/public
 git pull
 exit
EOF

echo 'Complete chiikawa-timer deploy'
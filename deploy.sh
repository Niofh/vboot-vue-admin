echo "===========进入git项目/usr/local/java/vboot/vboot-vue-admin目录============="
cd /usr/local/java/vboot/vboot-vue-admin

echo "==================切换分支======================"
git checkout master

echo "==================查看分支======================"
git branch

echo "==================git fetch======================"
git fetch

echo "==================git pull======================"
git pull


echo "===========cnpm install===================="
cnpm install

echo "===========npm run build===================="
npm run build:prod


echo "================暂停止5s，因为要打包========================="
for i in {1..5}
do
	echo $i"s"
	sleep 1s
done



echo "============删除/usr/local/java/nginx-vboot/www下的www文件============="
rm -rf usr/local/java/nginx-vboot/www/*


echo "============复制dist下的文件到/usr/local/java/nginx-vboot下的www文件============="
cp -r /usr/local/java/vboot/vboot-vue-admin/dist/  /usr/local/java/nginx-vboot/www


netstat -tunlp |grep 6001


scp -r ./lib  root@103.153.139.242:~/cic

scp -r ./package.json ./jsonDB.json root@103.153.139.242:~/cic/lib

scp -r ./file/patents root@103.153.139.242:~/cic/lib/file

scp ./src/utils/template.html  root@103.153.139.242:~/cic/lib/src/utils

telnet 103.153.139.242 10006

```angular2html

//
strings /lib64/libc.so.6 |grep GLIBC_

wget   http://ftp.gnu.org/pub/gnu/glibc/glibc-2.27.tar.gz

tar -xvf glibc-2.27.tar.gz
#进入glibc-2.27目录中
cd glibc-2.27
#创建build目录
mkdir build
#进入build目录中
cd build

## 安装 gcc
yum install gcc
#执行./configure
../configure --prefix=/usr --disable-profile --enable-add-ons --with-headers=/usr/include --with-binutils=/usr/bin

#安装
make && make install

// 查看共享库
ls -l /lib64/libc.so.6
=====================
//可以看到已经建立了软链接
lrwxrwxrwx. 1 root root 12 Jan 13 01:49 /lib64/libc.so.6 -> libc-2.17.so
```

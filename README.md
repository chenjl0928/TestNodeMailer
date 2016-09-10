TestNodemailer
===============

make a mail mid ,use the [nodemailer](https://github.com/nodemailer/nodemailer) moudle to send mail

## 使用nodemailer ##

1.使用nodemailer的mail pool模式，最大5个连接数，最大保持100个消息（可以配置）

2.支持发送普通邮件，和模板邮件

3.目前配置的是gmail

## 注意事项： ##

使用gmail需要注意以下两点，不然邮件发送不出去

1.给认证用的gmail打开，转发和POP/IMAP设置

https://mail.google.com/mail/u/0/#settings/fwdandpop

2.将认证用gmail允许不安全apps登录

https://www.google.com/settings/security/lesssecureapps

## 工程配置 ##
### mid\mail.ts ###
- defaultAuthGmail  认证用的邮箱，即往出发邮件用的邮箱，这里暂时先用我的gmail(c766593044@gmail.com)，后面需要更改
- defaultAuthGmailPwd 认证用的邮箱对应的密码
- defaultMailTos  目标用户，可以是个数组，
另外还可以可以配置cc和bcc，附件等属性

### mid\mail.config.ts ###
这个文件主要就是说明可以在外部定义邮件相关,mail内容相关的属性，
然后，使用的inversify绑定这个外部定义的属性即可。

## 工程运行 ##
由于中国防火墙屏蔽，所以mid\mail.config.ts文件设置了个浏览器代理，如果不在中国可以注释掉proxy这一句
-    mid\mail.config.ts


        export const myAppSmtpOptions :ISmtpPoolOptions = {
            ......
            // TODO: by chenjl,as some reason,we had to use a proxy in china,
            proxy: 'http://127.0.0.1:1080/'
        }
        
运行

1.安装依赖包 npm install ，typings install

2.编译 tsc -w

3.node app.js 会运行app\myapp.ts中写的两个例子，分别是发送普通邮件，发送模板邮件

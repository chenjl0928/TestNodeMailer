/**
 * Created by Chenjiulong on 2016/08/18.
 */

import {ISmtpPoolOptions,ISendMailOptions,defaultAuthGmail,defaultAuthGmailPwd} from './mail';

/**
 * gmail   :  host: 'smtp.gmail.com' ,port: 465 ,secure: true     (or):  service: 'Gmail',
 * 163.com :  host: 'smtp.163.com' ,port: 465 ,secure: true
 */
export const myAppSmtpOptions :ISmtpPoolOptions = {
    pool: true,
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // use SSL
    auth: {
        user: defaultAuthGmail,
        pass: defaultAuthGmailPwd
    },
    // log to console
    logger: true,
    // include SMTP traffic in the logs
    debug: true,
    // TODO: by chenjl,as some reason,we had to use a proxy in china,
    proxy: 'http://127.0.0.1:1080/'
}

export const myAppMessageFields: ISendMailOptions  = {
    from: defaultAuthGmail,
    to : [
        '"chenjiulong" <chenjl@lzt.com.cn>'
        ,'chen_jiulong@163.com'
    ],
    subject: 'Test gmail by front app'
};




/**
 * Created by chenjiulong on 2016/08/18.
 */

import * as inversify from 'inversify';
import {inject, injectable, KernelModule, multiInject} from 'inversify';
let nodemailer = require('nodemailer');
export function sendmail(){
    let poolConfig: any = {
        pool: true,
        //host: 'smtp.gmail.com',
        host:'smtp.163.com',
        port: 465,
        //port: 25,
        secure: true, // use SSL
        //service: 'Gmail',
        auth: {
            //user: 'c766593044@gmail.com',
            user: 'iq_storm@163.com',
            pass:'Aa123456'
        },
        logger: true, // log to console
        debug: true // include SMTP traffic in the logs
    };
    // default message fields
    let defaultMsgFields = {
        // sender info
        //from: 'Sender Name <sender@example.com>',
        from: 'iq_storm@163.com',
        //from: 'c766593044@gmail.com',
    };
    let transporter: any = nodemailer.createTransport(poolConfig, defaultMsgFields);

    // Message object
    let message: any = {

        // Comma separated list of recipients
        to: '"chenjiulong" <chenjl@lzt.com.cn>',

        // Subject of the message
        subject: 'Nodemailer is unicode friendly 2✔', //

        // plaintext body
        text: 'Hello to myself!',

        // HTML body
        html: '<p><b>Hello</b> to myself <img src="cid:note@example.com"/></p>' +
        '<p>Here\'s a nyan cat for you as an embedded attachment:<br/><img src="cid:nyan@example.com"/></p>',

        // Apple Watch specific HTML body
        watchHtml: '<b>Hello</b> to myself',

        // An array of attachments
        //attachments: [
        //
        //    // String attachment
        //    {
        //        filename: 'notes.txt',
        //        content: 'Some notes about this e-mail',
        //        contentType: 'text/plain' // optional, would be detected from the filename
        //    },
        //
        //    // Binary Buffer attachment
        //    {
        //        filename: 'image.png',
        //        content: new Buffer('iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAABlBMVEUAAAD/' +
        //            '//+l2Z/dAAAAM0lEQVR4nGP4/5/h/1+G/58ZDrAz3D/McH8yw83NDDeNGe4U' +
        //            'g9C9zwz3gVLMDA/A6P9/AFGGFyjOXZtQAAAAAElFTkSuQmCC', 'base64'),
        //
        //        cid: 'note@example.com' // should be as unique as possible
        //    },
        //
        //    // File Stream attachment
        //    {
        //        filename: 'nyan cat ✔.gif',
        //        path: __dirname + '/assets/nyan.gif',
        //        cid: 'nyan@example.com' // should be as unique as possible
        //    }
        //]
    };

    console.log('Sending Mail');
    transporter.sendMail(message, function (error: any, info: any) {
        if (error) {
            console.log('Error occurred');
            console.log(error.message);
            return;
        }
        console.log('Message sent successfully!');
        console.log('Server responded with "%s"', info.response);
    });
}

sendmail();
/**
 * Created by chenjiulong on 2016/08/18.
 */

import * as inversify from 'inversify';
import {inject, injectable, KernelModule, multiInject} from 'inversify';
let nodemailer = require('nodemailer');


/**
 * You can use 3 kinds of different approaches when using SMTP
 * normal usage.
 *      No specific configuration needed. For every e-mail a new SMTP connection is created and message is sent immediately.
 *      Used when the amount of sent messages is low.
 *      eg:var smtpConfig = {
 *          host: 'smtp.gmail.com',
 *          port: 465,
 *          secure: true, // use SSL
 *          auth: {
 *              user: 'user@gmail.com',
 *              pass: 'pass'
 *           }
 *      };
 * pooled usage.
 *      Set pool option to true to use it. A fixed amount of pooled connections are used to send messages.
 *      Useful when you have a large number of messages that you want to send in batches.
 * direct usage.
 *      Set direct option to true to use it. SMTP connection is opened directly to recipients MX server,
 *      skipping any local SMTP relays. useful when you do not have a SMTP relay to use.
 *      Riskier though since messages from untrusted servers usually end up in the Spam folder.
 */

export function sendmail(){
    let poolConfig: any = {
        pool: true,
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // use SSL
        // service: 'Gmail',
        auth: {
            user: 'test.nodemailer@gmail.com',
            pass: 'Nodemailer123'
        },
        logger: true, // log to console
        debug: true // include SMTP traffic in the logs
    };
    // default message fields
    let defaultMsgFields = {
        // sender info
        //from: 'Sender Name <sender@example.com>',
        from: 'test.nodemailer@gmail.com',
    };
    let transporter: any = nodemailer.createTransport(poolConfig, defaultMsgFields);

    // Message object
    let message: any = {

        // Comma separated list of recipients
        to: '"chenjiulong" <chenjl@lzt.com.cn>',

        // Subject of the message
        subject: 'Nodemailer is unicode friendly ✔', //

        // plaintext body
        text: 'Hello to myself!',

        // HTML body
        html: '<p><b>Hello</b> to myself <img src="cid:note@example.com"/></p>' +
        '<p>Here\'s a nyan cat for you as an embedded attachment:<br/><img src="cid:nyan@example.com"/></p>',

        // Apple Watch specific HTML body
        watchHtml: '<b>Hello</b> to myself',

        // An array of attachments
        attachments: [

            // String attachment
            {
                filename: 'notes.txt',
                content: 'Some notes about this e-mail',
                contentType: 'text/plain' // optional, would be detected from the filename
            },

            // Binary Buffer attachment
            {
                filename: 'image.png',
                content: new Buffer('iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAABlBMVEUAAAD/' +
                    '//+l2Z/dAAAAM0lEQVR4nGP4/5/h/1+G/58ZDrAz3D/McH8yw83NDDeNGe4U' +
                    'g9C9zwz3gVLMDA/A6P9/AFGGFyjOXZtQAAAAAElFTkSuQmCC', 'base64'),

                cid: 'note@example.com' // should be as unique as possible
            },

            // File Stream attachment
            {
                filename: 'nyan cat ✔.gif',
                path: __dirname + '/assets/nyan.gif',
                cid: 'nyan@example.com' // should be as unique as possible
            }
        ]
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
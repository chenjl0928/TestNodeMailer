/**
 * Created by chenjiulong on 2016/08/18.
 */

import * as inversify from 'inversify';
import {inject, injectable, KernelModule, multiInject} from 'inversify';
import * as nodemailer from 'nodemailer';
import * as smtpTransport from 'nodemailer-smtp-transport';
import * as smtpPool from 'nodemailer-smtp-pool';
import {Transporter, SendMailOptions, SentMessageInfo} from 'nodemailer';

/**
 *
 * @type {{pool: boolean, host: string, port: number, secure: boolean, auth: {user: string, pass: string}, logger: boolean, debug: boolean}}
 */
export let defaultPoolConfig: smtpPool.SmtpPoolOptions  = {
    //pool: true,
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // use SSL
    // service: 'Gmail',
    auth: {
        user: 'test.nodemailer@gmail.com',
        pass: 'Nodemailer123'
    },
    //logger: true,       // log to console
    debug: true         // include SMTP traffic in the logs
};

export let defaultMsgFields: SendMailOptions  = {
    // sender info
    //from: 'Sender Name <sender@example.com>',
    from: 'test.nodemailer@gmail.com',
};

/**
 * make the default node mail transport
 * @param poolConfig
 * @param msgFields
 * @returns {Transporter}
 */
export function loadTransporter(poolConfig?:smtpTransport.SmtpOptions, msgFields? : SendMailOptions): Transporter {
    poolConfig = poolConfig || defaultPoolConfig;
    msgFields = msgFields || defaultMsgFields;
    let transporter: Transporter = nodemailer.createTransport(poolConfig, defaultMsgFields);
    return transporter;
}

export function sendmail(message: SendMailOptions){
    // TODO: change to a single instance
    let transporter: Transporter = loadTransporter();

    console.log('Sending Mail');
    transporter.sendMail(message, (error: Error, info: SentMessageInfo) : void =>{
        if (error) {
            console.log('Error occurred');
            console.log(error.message);
            return;
        }
        console.log('Message sent successfully!');
        console.log('Server responded with "%s"', info.response);
    });
}
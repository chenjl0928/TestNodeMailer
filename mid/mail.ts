/**
 * Created by Chenjiulong on 2016/08/18.
 */

import * as inversify from 'inversify';
import {inject, injectable, KernelModule} from 'inversify';
import * as nodemailer from 'nodemailer';
import * as smtpTransport from 'nodemailer-smtp-transport';
import * as smtpPool from 'nodemailer-smtp-pool';
import {Transporter, SendMailOptions, SentMessageInfo} from 'nodemailer';

/**
 * the auth mail
 * @type {string}
 */
export const defaultAuthGmail: string = 'c766593044@gmail.com';
// TODO:
export const defaultAuthGmailPwd: string = 'your gmail password';
export const defaultMailTos : [string] = [
    '"chenjiulong" <chenjl@lzt.com.cn>'
];


/**
 * To use Gmail
 *   1.you may need to configure "Allow Less Secure Apps" in your Gmail account
 *     unless you are using 2FA in which case you would have to create an Application Specific password.
 *   2.You also may need to unlock your account with "Allow access to your Google account" to use SMTP.
 *
 * usage: eg:
 *      gmail   :  host: 'smtp.gmail.com' ,port: 465 ,secure: true     (or):  service: 'Gmail',
 *      163.com :  host: 'smtp.163.com' ,port: 465 ,secure: true
 */
export const defaultGmailSmtpOptions :ISmtpPoolOptions = {
    pool: true,
    service: 'Gmail',
    secure: true, // use SSL
    auth: {
        user: defaultAuthGmail,
        pass: defaultAuthGmailPwd
    }
}

export const defaultMessageFields: ISendMailOptions  = {
    // sender info
    from: defaultAuthGmail,
    to : defaultMailTos,
};

/**
 * mail kernel module
 * @type {KernelModule}
 */
export function loadMailModule(poolOptions: ISmtpPoolOptions, msgFileds: ISendMailOptions){
   return new KernelModule((bind) => {
        bind('ISmtpPoolOptions').toConstantValue(poolOptions);
        bind('ISendMailOptions').toConstantValue(msgFileds);
        // the mail manager is a single instance. because we want to create the transporter object only once
        bind('MailManager').to(MailManager).inSingletonScope();
    });
};

@injectable()
export class MailManager {
    /**
     * transporter is going to be an object that is able to send mail.
     * You have to create the transporter object only once.
     * If you already have a transporter object you can use it to send mail as much as you like.
     * @type {null}
     * @private
     */
    private _transporter: Transporter = null;

    constructor(@inject('ISmtpPoolOptions') private defaultSmtpOptions: ISmtpPoolOptions,
        @inject('ISendMailOptions') private defaultMsgFields: ISendMailOptions)
    {
        this._transporter = this.loadTransporter(defaultSmtpOptions, defaultMsgFields);
    }

    /**
     * make the default node mail transport
     * user can use 3 kinds of different approaches when using SMTP,1.normal usage,2.pooled usage.3.direct usage
     *
     * here we user Mode2.pooled usage:
     *      Set pool option to true to use it. A fixed amount of pooled connections are used to send messages.
     *      Useful when you have a large number of messages that you want to send in batches.
     *
     * @param poolConfig
     * @param msgFields
     * @returns {Transporter}
     */
   loadTransporter(poolConfig?:smtpTransport.SmtpOptions, msgFields? : SendMailOptions): Transporter {
        poolConfig = poolConfig || defaultGmailSmtpOptions;
        msgFields = msgFields || defaultMessageFields;
        let transporter: Transporter = nodemailer.createTransport(poolConfig, msgFields);
        return transporter;
    }

    /**
     * transporter is going to be an object that is able to send mail.
     * @returns {Transporter}
     */
    get transporter(){
        return this._transporter;
    }

    /**
     * Once you have a transporter object you can send mail with it
     * @param message
     * @returns {Promise<string>}
     */
    public sendMail(message: SendMailOptions): Promise<string>{
        console.log('Sending Mail');

        return new Promise<string>(async (resolve, reject) => {
            this._transporter.sendMail(message, (error: Error, info: SentMessageInfo) : void =>{
                if (error) {
                    console.log('Error occurred',error.message);
                    reject(error.message);
                }
                console.log('Message sent successfully! Server responded with "%s"', info.response);
                resolve(info.response);
            });
        });
    }

    /**
     * simple mail
     * if #html has value,the #text will be ignore
     */
    public sendSimpleMail(subject:string, text: string, html?: string): Promise<string>{
        let options: any = {
            // Subject of the message
            subject: subject,
            // plaintext body
            text: text,
        };
        // html area
        if(html){
            options['html'] = html;
        }
        let simpleMessage = Object.assign(options, this.defaultMsgFields);
        return this.sendMail(simpleMessage);
    }

    /**
     *
     *@param mailData
     *          includes message fields for current message
     *@template
     *
     *@param context
     *          is an object with template replacements, where key replaces {{key}} when using the built-in renderer
     *@param defaults
     *          is an optional object of message data fields that are set for every message sent using this sender
     *
     *@usage:
     *      https://github.com/nodemailer/nodemailer#using-templates
     */
    public sendTemplateMail(mailData:SendMailOptions, template: any, context:any, defaults?: any): Promise<string>{
        console.log('Sending template mail');
        return new Promise<string>(async (resolve, reject) => {
            let send = this._transporter.templateSender(template, defaults);
            send(mailData, context).then((info: SentMessageInfo)=>{
                console.log('Sending template mail success',info.response);
                resolve(info.response);
            }).catch((error: any)=>{
                console.log('Sending template mail error',error.message);
                reject(error.message);
            });
        });
    }
}

export interface ISmtpPoolOptions extends smtpPool.SmtpPoolOptions {
    /**
     * options.pool
     *      if set to true uses pooled connections (defaults to false), otherwise creates a new connection for every e-mail.
     */
    pool?: boolean;
    /**
     * options.logger
     *      optional bunyan compatible logger instance. If set to true then logs to console.
     *      If value is not set or is false then nothing is logged
     */
    logger?: boolean; // log to console
    /**
     * options.proxy
     *      Nodemailer supports out of the box HTTP and SOCKS proxies for SMTP connections with the proxy configuration option.
     *      You can also use a custom connection handler with the getSocket method.
     */
    proxy?: string;
    /**
     * options.service
     *      If you do not want to specify the hostname, port and security settings for a well known service,
     *      you can use it by its name (case insensitive)
     *
     *      See the list of all supported services here:
     *      (https://github.com/nodemailer/nodemailer-wellknown#supported-services).
     */
    service?: string;
}

/**
 * user define
 */
export interface ISendMailOptions extends SendMailOptions {
    /**
     * The e-mail address of the sender. All e-mail addresses can be plain 'sender@server.com'
     * or formatted 'Sender Name <sender@server.com>', see here for details
     */
    from: string;
    /**
     * Comma separated list or an array of recipients e-mail addresses that will appear on the To: field
     */
    to: string|string[];
}

/**
 * Created by Chenjiulong on 2016/08/18.
 */

import "reflect-metadata";
import * as mid from '../mid';
import * as inversify from 'inversify';

export const kernel = new inversify.Kernel();
kernel.bind('Kernel').toConstantValue(kernel);
kernel.load(mid.loadMailModule(mid.myAppSmtpOptions,mid.myAppMessageFields));

// 1.send mail
let mailMgr: mid.MailManager = kernel.get<mid.MailManager>('MailManager');
//
mailMgr.sendSimpleMail('test hello world', 'the context of hello world');


// 2.send a template mail
let template = {
    subject: 'This template is used for the {{mysubject}} field',
    //text: 'This template is used for the {{mytext}} field',
    html: '<div><strong>{{myhtml}}</strong> is an object with template strings for built-in renderer or an <a href="https://github.com/niftylettuce/node-email-templates">EmailTemplate</a> object for more complex rendering</div>'
};

let context: any = {
    mysubject : 'hello world subject',
    //mytext : 'hello world text',
    myhtml : 'templates'
}

let maildata: mid.ISendMailOptions = {
    from: mid.defaultAuthGmail,
    to:mid.defaultMailTos,
}

// send template mail
mailMgr.sendTemplateMail(maildata, template, context, {});

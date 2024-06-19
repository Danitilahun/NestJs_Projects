/* eslint-disable prettier/prettier */

import Mail from 'nodemailer/lib/mailer';
import { verifyAccountTemplate } from './mails/verifty-account.template';
export const mailerOption=(email:string,activationCode:string,token:string)=>{
  const mailerOptions: Mail.Options = {
    from: {
      name: `Deribew Shimelis`,
      address: `deribewsoftware@gmail.com`,
    },
    to: email,
    subject: `Verify Your Email`,
    html:verifyAccountTemplate(activationCode,token)
  };


  return mailerOptions;
}
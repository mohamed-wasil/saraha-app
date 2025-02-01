import nodemailer from "nodemailer"
import { EventEmitter } from "node:events";
export const sendEmailService = async ({ to, subject, html, attachments }) => {
    try {
        // console.log({
        //     user: process.env.EMAIL_USER,
        //     pass: process.env.EMAIL_PASS,
        // });

        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
            // tls:{
            //     rejectUnauthorized: false,
            // }
        })

        const info = await transporter.sendMail({
            from: `"No Reply" <${process.env.EMAIL_USER}>`, // sender address
            to, // list of receivers
            subject, // Subject line
            html, // html body
            attachments
        });

        return info
    } catch (error) {
        console.error('Failed to send email', error);
        return error;
    }

}


export const emitter = new EventEmitter();
emitter.on("sendEmail", ({ ...args }) => {
    const { to, subject, html, attachments } = args
    // console.log(args);


    sendEmailService({
        to,
        subject,
        html,
        attachments
    })
    console.log("Email Sending...");

})



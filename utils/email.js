const nodemailer = require('nodemailer')

const sendEmail = async options =>{
    const transporter = nodemailer.createTransport({
        host: process.env.MAILGUN_HOSTNAME,
        port: process.env.MAILGUN_PORT,
        auth: {
            user: process.env.MAILGUN_USERNAME,
            pass: process.env.MAILGUN_PASSWORD
        }
    });

    const mailOptions = {
        from:'Suporte <suporte@cebraspecrawlerx.tech>',
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: options.html
        
    }

    await transporter.sendMail(mailOptions)
}
module.exports ={sendEmail}
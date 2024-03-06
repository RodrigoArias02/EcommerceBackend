import nodemailer from 'nodemailer'

const transport=nodemailer.createTransport(
    {
        service:'gmail',
        port: 587,
        auth:{
            user:"rodrigo02.test@gmail.com",
            pass:"jfgo lyxo gmek rlyd"
        }
    }
)

export const submitEmail=(to, subject, message)=>{
    return transport.sendMail(
        {
            to, subject,
            html:message
        }
    )
}
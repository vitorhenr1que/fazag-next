import nodemailer from 'nodemailer'

const email = process.env.USERMAILPS
const pass = process.env.PASSMAILPS

export const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: email,
        pass,
    }
})

export const mailOptions = {
    from: email,
    to: email
}
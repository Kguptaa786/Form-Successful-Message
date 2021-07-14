const express = require('express')
const bodyParsers = require('body-parser')
const nodemailer = require("nodemailer");
const ejs = require('ejs')
const app = express()
const path = require('path');
const bodyParser = require('body-parser');
const port = 2020

require('dotenv').config()

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '/views'))

app.use(bodyParsers.urlencoded({ extended: false }))
app.use(bodyParsers.json())

app.get('/', (req, res) => {
    res.render('index')
})

app.post('/success', async (req, res) => {
    const output = `
        <p>You have a new message</p>
        <h3>Contact Detail</h3>
        <ul>
        <li>Name: ${req.body.name}</li>
        <li>Email: ${req.body.email}</li>
        </ul>
        <h3>Message:</h3>
        <p>${req.body.message}</p>
    `
    let transporter = nodemailer.createTransport({
        host: "smtp-mail.outlook.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'dummyForWebDev@outlook.com', // generated ethereal user
            pass: 'abcd_1234@' // generated ethereal password
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"From dummy account" <dummyForWebDev@outlook.com>', // sender address
        to: `${req.body.email}`, // list of receivers
        subject: 'Do not reply!!!', // Subject line
        text: "Hello world", // plain text body
        html: output, // html body
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    res.render('successPage')
})

app.listen(port, () => {
    console.log(`listening to port: ${port}`)
})
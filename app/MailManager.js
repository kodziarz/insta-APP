const dotenv = require("dotenv")
const nodemailer = require("nodemailer")
class MailManager {

    #config
    #transporter

    constructor() {

        this.#config = {
            service: "Yahoo",
            auth: {
                user: process.env.APP_MAIL_NAME,
                pass: process.env.APP_MAIL_PASSWORD
            }
        }

        this.#transporter = nodemailer.createTransport(this.#config)
    }

    sendMail = async () => {

    }
}
module.exports = MailManager
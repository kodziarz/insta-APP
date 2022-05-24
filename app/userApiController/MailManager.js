const dotenv = require("dotenv")
const nodemailer = require("nodemailer")
const logger = require("tracer").colorConsole()
class MailManager {

    #config
    #transporter

    constructor() {

        //dotenv.config()

        this.#config = {
            host: "kodziarz@yahoo.com",
            service: "Yahoo",
            auth: {
                user: process.env.APP_MAIL_NAME,
                pass: process.env.APP_MAIL_PASSWORD
            }
        }

        this.#transporter = nodemailer.createTransport(this.#config)
    }

    sendAuthorisationMail = async (receiver, token) => {
        this.#transporter.sendMail({
            from: "kodziarz@yahoo.com",
            to: receiver,
            subject: "Authorisation",
            text: "Twój token autoryzacyjny to: " + token,
            html: "<html>Twój token autoryzacyjny to: <a href=\"http://localhost:3000/api/user/confirm/" + token + "\">potwierdź konto</a></html>"
        })
    }
}
module.exports = MailManager
const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")
const logger = require("tracer").colorConsole()

class TokensManager {

    #tokens = []

    constructor() {

    }

    createVerificationToken = async (email, name, lastName, password) => {

        let data = {
            id: new Date().getTime(),
            email: email,
            name: name,
            lastName: lastName,
            password: password,
            confirmed: false
        }
        return await this.#createToken("3m", data)
    }

    createLoginToken = async (id, email, name, lastName, password) => {

        let data = {
            id: id,
            email: email,
            name: name,
            lastName: lastName,
            password: password,
            confirmed: true
        }
        return await this.#createToken("6h", data)
    }

    #createToken = async (expirationTime, data) => {
        // weryfikacja danych:
        //email
        if (!data.email.includes("@"))
            throw {
                status: "WrongMailFormat",
                message: "Mail must contain at @ sign."
            }
        // name, lastName
        if (data.name == null || data.lastName == null)
            throw {
                status: "WrongNameOrSurname",
                message: "Name and last name cannot be empty."
            }
        // password
        if (typeof data.password != "string")
            throw {
                status: "WrongPasswordType",
                message: "Password has to be of type String."
            }
        if (data.password.length < 4)
            throw {
                status: "IllegalPassword",
                message: "Password has to be at least 4 chars long."
            }

        // właściwa funkcja
        let token = await jwt.sign(
            data,
            process.env.KEY_FOR_TOKENS, // powinno być w .env
            {
                expiresIn: expirationTime // "1m", "1d", "24h"
            }
        );
        this.#tokens.push(token)
        logger.debug("utworzono token: ", token)
        return token
    }

    isTokenValid = async (token) => {
        try {
            await jwt.verify(token, process.env.KEY_FOR_TOKENS)
            return !(this.#tokens.every((e) => {
                return e != token
            }))
        } catch (ex) {
            return false
        }
    }


    getTokenData = async (token) => {
        try {
            return await jwt.verify(token, process.env.KEY_FOR_TOKENS)
        } catch (ex) {
            logger.warn("Token wygasł lub nigdy nie istniał.")
            throw ex
        }
    }


}

module.exports = TokensManager
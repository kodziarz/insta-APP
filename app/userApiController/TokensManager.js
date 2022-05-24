const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")
const logger = require("tracer").colorConsole()

class TokensManager {

    #tokens = []

    constructor() {

    }

    createToken = async (mail, name, lastName) => {

        let token = await jwt.sign(
            {
                email: "aaa@yahoo.com",
                anyData: "123"
            },
            process.env.KEY_FOR_TOKENS, // powinno być w .env
            {
                expiresIn: "60s" // "1m", "1d", "24h"
            }
        );
        this.#tokens.push(token)
        logger.debug("utworzono token: ", token)
        return token
    }

    verifyToken = async (token) => {
        logger.debug("otrzymany parametr: ", token)
        logger.debug("verify token: ", await jwt.verify(token, process.env.KEY_FOR_TOKENS))
    }


}

module.exports = TokensManager
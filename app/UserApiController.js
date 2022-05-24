const MailManager = require("./userApiController/MailManager")
const TokensManager = require("./userApiController/TokensManager")

class UserApiRouter {

    #tokensManager
    #mailManager


    constructor() {
        this.#tokensManager = new TokensManager()
        this.#mailManager = new MailManager
    }

    registerUser = async (req) => {
        return new Promise(async (resolve) => {
            let token = await this.#tokensManager.createToken(req.mail, req.name, req.lastName)
            this.#tokensManager.verifyToken(token)
            this.#mailManager.sendAuthorisationMail(req.email, token)
        })
    }
}

module.exports = UserApiRouter
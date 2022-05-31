const MailManager = require("./userApiController/MailManager")
const TokensManager = require("./userApiController/TokensManager")
const UsersManager = require("./userApiController/UsersManager")
const logger = require("tracer").colorConsole()

class UserApiRouter {

    #tokensManager
    #mailManager
    #usersManager


    constructor() {
        this.#tokensManager = new TokensManager()
        this.#mailManager = new MailManager()
        this.#usersManager = new UsersManager()
    }

    registerUser = async (req) => {
        let token = await this.#tokensManager.createVerificationToken(req.email, req.name, req.lastName, req.password)
        this.#mailManager.sendAuthorisationMail(req.email, token)
    }

    confirmUser = async (token) => {
        try {
            let data = await this.#tokensManager.getTokenData(token)
            data.confirmed = true
            delete data.iat
            delete data.exp
            //data.token = await this.#tokensManager.createLoginToken(data.id, data.email, data.name, data.lastName, data.password)
            await this.#usersManager.saveUser(data)
            logger.log("Zapisano użytkownika o id: ", data.id)
            logger.debug(await this.#usersManager.getUserById(data.id))
        } catch (ex) {
            throw ex
        }
    }

    loginUser = async (userName, password) => {
        // rzuca WrongCredentialsException i WrongParametersException

        if (userName == null || userName == undefined
            || password == null || password == undefined)
            throw {
                status: "WrongParametersException",
                message: "Given parameters are incorrect"
            }

        if (await this.#usersManager.checkUsersPasswordByUserName(userName, password)) {
            let userData = await this.#usersManager.getUserByUserName(userName)
            userData.token = await this.#tokensManager.createLoginToken(userData.id, userData.email, userData.name, userData.lastName, userData.password)
            logger.log("Zalogowano użytkownika o id: ", userData.id)
            return userData.token
        } else {
            throw {
                status: "WrongCredentialsException",
                message: "Incorrect credentials"
            }
        }
    }

    getAllUsers = async () => {
        return await this.#usersManager.getAllUsers()
    }
}

module.exports = UserApiRouter
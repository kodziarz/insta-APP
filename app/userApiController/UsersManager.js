const { Users } = require("./Model")
const bcrypt = require("bcrypt")
const logger = require("tracer").colorConsole()

class UsersManager {

    constructor() {

    }

    saveUser = async (userData) => {
        if (!(userData instanceof Object)) {
            console.error("Otrzymano dane nie będące obiektem.")
            throw {
                status: "WrongDataType",
                message: "Funkcja saveUser jako parametr przyjmuje obiekt z danymi użytkownika."
            }
        } else if (userData.id == undefined || userData.id == null
            || userData.name == undefined || userData.name == null
            || userData.lastName == undefined || userData.lastName == null
            || userData.email == undefined || userData.email == null
            || userData.password == undefined || userData.password == null) {
            throw {
                status: "NotEnoughParameters",
                message: "Funkcja saveUser jako parametr przyjmuje obiekt, który musi zawierać pola: id, name, lastName, email, confirmed i password."
            }
        } else if (!userData.confirmed)
            throw {
                status: "NotVerifiedUser",
                message: "Nie można zapisać niezweryfikowanego użytkownika."
            }

        // haszowanie hasła
        let password = userData.password
        userData.password = await bcrypt.hash(password, 10)

        Users[userData.id] = userData
    }

    checkUsersPasswordById = async (userId, password) => {
        // rzuca UserNotFoundException

        let user = this.getUserById(userId)
        if (await bcrypt.compare(password, user.password)) {
            return true
        } else {
            return false
        }
    }

    checkUsersPasswordByUserName = async (userName, password) => {
        // rzuca UserNotFoundException

        try {
            let user = await this.getUserByUserName(userName)
            if (await bcrypt.compare(password, user.password)) {
                return true
            } else {
                return false
            }
        } catch (ex) {
            if (ex.status == "UserNotFoundException") {
                return false
            } else {
                throw ex
            }
        }
    }

    getUserByUserName = async (userName) => {
        // rzuca UserNotFoundException

        return new Promise((resolve) => {
            if (Object.values(Users).every((e) => {
                if (userName == e.name) {
                    resolve(e)
                    return false
                }
            })) {
                throw {
                    status: "UserNotFoundException",
                    message: "There is no such a user in a data base."
                }
            }
        })
    }

    getUserById = async (userId) => {
        // rzuca UserNotFoundException

        if (!(Users[userId] instanceof Object))
            throw {
                status: "UserNotFoundException",
                message: "There is no such a user in a data base."
            }
        return Users[userId]
    }

    getAllUsers = async () => {
        return Object.values(Users)
    }
}

module.exports = UsersManager
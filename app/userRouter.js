const path = require("path")
const fs = require("fs")
const logger = require('tracer').colorConsole()
const RequestDataHandler = require("./RequestDataHandler")

// załącz controller, utils , tablicę zwierząt

//const utils = require("./utils")
//const controller = require("./controller")

//const viewsPath = path.join(__dirname, "views")

const router = async (request, response, userApiController) => {

    //let main = new Main()
    // obsługa zapytań

    //logger.debug("Przyszło zapytanie metodą: ", request.method)
    switch (request.method) {
        case "GET":
            switch (true) {
                case request.url.match(/api\/user\/confirm\//) != null:
                    logger.info("Odebrano zapytanie o potwierdzenie użytkownika tokenem.")
                    let token = request.url.split("/")[4]
                    logger.log("otrzymany token: ", token)
                    try {
                        await userApiController.confirmUser(token)
                        response.writeHead(200, { "Content-Type": "application/json" }); // token authorized                        logger.log("Zweryfikowano token jako ważny")

                    } catch (ex) {
                        switch (ex.status) {
                            case "TokenExpiredError": {
                                response.writeHead(401, { "Content-Type": "application/json" }); // invalid token
                                logger.log("Zweryfikowano token jako nieważny")
                                break
                            } default: {
                                response.writeHead(502, { "Content-Type": "application/json" }); // internal server error
                                logger.error("Wystąpił jakiś nieobsługiwany błąd: ", ex)
                            }
                        }

                    }
                    break
                case request.url == "/api/user":
                    logger.info("Odebrano zapytanie o wysłanie listy wszystkich użytkowników.")
                    response.end(JSON.stringify(
                        await userApiController.getAllUsers(),
                        null,
                        5
                    ))
                    logger.log("Odesłano listę użytkowników.")
                    break
                default:
                    logger.warn("Przyszło zapytanie metodą: ", request.method, " na nieobsługiwany url: ", request.url)
                    response.end("end")
                    break
            }
            break

        case "POST":
            switch (true) {
                case request.url == "/api/user/register": {
                    let req = RequestDataHandler.getRequestPromise(request)
                    logger.info("Odebrano zapytanie o zajerestrowanie użytkownika.")
                    req = await req

                    try {
                        await userApiController.registerUser(req)
                    } catch (ex) {
                        logger.warn("Otrzymane dane nie spełniają jakiś założeń")
                        logger.error(ex)
                    }
                    response.end("cośtam idzie")
                }
                    break
                case request.url == "/api/user/login": {
                    let req = RequestDataHandler.getRequestPromise(request)
                    logger.info("Odebrano zapytanie o zalogowanie użytkownika.")
                    req = await req
                    logger.debug("req: ", req)

                    try {
                        let token = await userApiController.loginUser(req.name, req.password)
                        response.writeHead(200, { "Content-Type": "application/json" }); // token authorized                        response.end()
                        response.end(JSON.stringify(
                            { token: token }
                        ))
                        console.log("Pomyślnie zalogowano użytkownika");
                    } catch (ex) {
                        switch (ex.status) {
                            case "WrongParametersException": {
                                response.writeHead(400, { "Content-Type": "application/json" }); // niepełne dane usera
                                response.end()
                                logger.warn("Otrzymano niepełne dane użytkownika.")
                                break
                            } case "WrongCredentialsException": {
                                response.writeHead(404, { "Content-Type": "application/json" }); // user not found
                                response.end()
                                logger.log("usytkownik o nazwie: ", req.name, " nie istnieje lub podano błędne hasło")
                                break
                            } default: {
                                logger.error("otrzymano nieobsłużony błąd:")
                                logger.error(ex)
                                break
                            }
                        }
                    }
                }
                    break
                default:
                    logger.warn("Przyszło zapytanie metodą: ", request.method, " na nieobsługiwany url: ", request.url)
                    response.end("end")
                    break
            }
            break
        // case "DELETE":
        //     switch (true) {
        //         case request.url.match(/\/api\/photos\/([0-9]+)/) != null:
        //             let id = request.url.split("/")[3]
        //             logger.info("Odebrano zapytanie o usunięcie zdjęcia o id: ", id)
        //             response.end(JSON.stringify(
        //                 await tagsApiController.deleteFileById(id, request),
        //                 null,
        //                 5
        //             ))
        //             break
        //         default:
        //             logger.warn("Przyszło zapytanie metodą: ", request.method, " na nieobsługiwany url: ", request.url)
        //             response.end("end")
        //             break
        //     }
        //     break
        // case "PATCH":
        //     switch (true) {
        //         case request.url.match(/\/api\/photos\/([0-9]+)/) != null:
        //             let id = request.url.split("/")[3]
        //             logger.info("Odebrano zapytanie o edycję pliku o id: ", id)
        //             response.end(JSON.stringify(
        //                 await tagsApiController.editFileById(id, request),
        //                 null,
        //                 5
        //             ))
        //             break
        //         default:
        //             logger.warn("Przyszło zapytanie metodą: ", request.method, " na nieobsługiwany url: ", request.url)
        //             response.end("end")
        //             break
        //     }
        //     break
        default:
            logger.error("Przyszło zapytanie o nieobsługiwanej metodzie: ", request.method)
            response.end("404")
            break
    }
}

module.exports = router

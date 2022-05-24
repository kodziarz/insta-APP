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
                    response.end(JSON.stringify(
                        { response: "Niby 404 ale git" },
                        null,
                        5
                    ))
                    logger.log("Odesłano listę tagów.")
                    break
                case request.url == "/api/user":
                    logger.info("Odebrano zapytanie o wysłanie listy wszystkich użytkowników.")
                    response.end(JSON.stringify(
                        await tagsApiController.getAllTags(),
                        null,
                        5
                    ))
                    logger.log("Odesłano listę tagów.")
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

                    // zabezpieczenie
                    if ((req.name == null || req.name == undefined)
                        && (req.lastName == null || req.lastName == undefined)
                        && (req.email == null || req.email == undefined)
                        && (req.name == null || req.name == undefined)) {
                        logger.warn("Pod adresem: ", request.url, " otrzymano obiekt nie posiadający odpowiednich danych.")
                        response.end(null)
                    }

                    await userApiController.registerUser(req)
                    response.end("cośtam idzie")
                }
                    break
                case request.url == "/api/user/login": {
                    let req = RequestDataHandler.getRequestPromise(request)
                    logger.info("Odebrano zapytanie o zalogowanie użytkownika.")
                    req = await req

                    logger.debug("Dalsza część jest nieskończona.")
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

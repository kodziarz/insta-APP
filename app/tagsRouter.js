const path = require("path")
const fs = require("fs")
const logger = require('tracer').colorConsole()
const RequestDataHandler = require("./RequestDataHandler")

// załącz controller, utils , tablicę zwierząt

//const utils = require("./utils")
//const controller = require("./controller")

//const viewsPath = path.join(__dirname, "views")

const router = async (request, response, tagsApiController) => {

    //let main = new Main()
    // obsługa zapytań

    //logger.debug("Przyszło zapytanie metodą: ", request.method)
    switch (request.method) {
        case "GET":
            switch (true) {
                case request.url == "/api/tags/raw":
                    logger.info("Odebrano zapytanie o wysłanie listy wszystkich nazw tagów.")
                    response.end(JSON.stringify(
                        await tagsApiController.getAllTagsNames(),
                        null,
                        5
                    ))
                    logger.log("Odesłano listę tagów.")
                    break
                case request.url == "/api/tags":
                    logger.info("Odebrano zapytanie o wysłanie listy wszystkich tagów.")
                    response.end(JSON.stringify(
                        await tagsApiController.getAllTags(),
                        null,
                        5
                    ))
                    logger.log("Odesłano listę tagów.")
                    break
                case request.url.match(/\/api\/tags\/([0-9]+)/) != null:
                    let id = request.url.split("/")[3]
                    logger.info("Odebrano zapytanie o wysłanie taga o id: ", id)
                    response.end(JSON.stringify(
                        await tagsApiController.getTagById(id),
                        null,
                        5
                    ))
                    break
                default:
                    logger.warn("Przyszło zapytanie metodą: ", request.method, " na nieobsługiwany url: ", request.url)
                    response.end("end")
                    break
            }
            break

        case "POST":
            switch (true) {
                case request.url == "/api/tags":
                    let req = RequestDataHandler.getRequestPromise(request)
                    logger.info("Odebrano zapytanie o dodanie taga.")
                    req = await req
                    if (req.name != undefined && req.name != null) {
                        let filesList = await tagsApiController.createTag(req.name)
                        response.end(JSON.stringify(filesList, null, 5))
                    } else {
                        logger.warn("Otrzymane zapytanie nie zawiera informacji o nazwie taga. Odsyłam nulla.")
                        response.end(null)
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

const path = require("path")
const fs = require("fs")
const logger = require('tracer').colorConsole()
const Main = require("./ImagesApiController")
const RequestDataHandler = require("./RequestDataHandler")

// załącz controller, utils , tablicę zwierząt

//const utils = require("./utils")
//const controller = require("./controller")

//const viewsPath = path.join(__dirname, "views")

const router = async (request, response, imagesApiController, tagsApiController) => {

    //let main = new Main()
    // obsługa zapytań

    //logger.debug("Przyszło zapytanie metodą: ", request.method)
    switch (request.method) {
        case "GET":
            switch (true) {
                case request.url == "/api/photos":
                    logger.info("Odebrano zapytanie o wysłanie wszystkich plików.")
                    response.end(JSON.stringify(
                        await imagesApiController.getAllFiles(request),
                        null,
                        5
                    ))
                    logger.log("Odesłano wszystkie obrazki.")
                    break
                case request.url.match(/\/api\/photos\/([0-9]+)/) != null:
                    let id = request.url.split("/")[3]
                    logger.info("Odebrano zapytanie o wysłanie pliku o id: ", id)
                    response.end(JSON.stringify(
                        await imagesApiController.getFileById(id, request),
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
                case request.url == "/api/photos":
                    logger.info("odebrano zapytanie o zapisanie pliku")
                    let filesList = await imagesApiController.loadFile(request)
                    response.end(JSON.stringify(filesList, null, 5))
                    break
                default:
                    logger.warn("Przyszło zapytanie metodą: ", request.method, " na nieobsługiwany url: ", request.url)
                    response.end("end")
                    break
            }
            break
        case "DELETE":
            switch (true) {
                case request.url.match(/\/api\/photos\/([0-9]+)/) != null:
                    let id = request.url.split("/")[3]
                    logger.info("Odebrano zapytanie o usunięcie zdjęcia o id: ", id)
                    response.end(JSON.stringify(
                        await imagesApiController.deleteFileById(id, request),
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
        case "PATCH":
            switch (true) {
                // case request.url.match(/\/api\/photos\/([0-9]+)/) != null:
                //     let id = request.url.split("/")[3]
                //     logger.info("Odebrano zapytanie o edycję pliku o id: ", id)
                //     response.end(JSON.stringify(
                //         await imagesApiController.editFileById(id, request),
                //         null,
                //         5
                //     ))
                //     break
                case request.url.match(/\/api\/photos\/([0-9]+)\/tags/) != null:
                    let req = RequestDataHandler.getRequestPromise(request)
                    let id2 = request.url.split("/")[3]
                    logger.info("Odebrano zapytanie o dodanie taga do pliku o id: ", id2)
                    req = await req
                    // zabezbpieczenie przed brakiem danych
                    if (req.tag == undefined || req.tag == null) {
                        logger.warn("Otrzymane zapytanie o dodanie taga do zdjęcia nie zawiera nazwy taga. Odsyłam nulla.")
                        return response.end(null)
                    }
                    //zabezpieczenie przed brakiem taga
                    if (!(await tagsApiController.doesTagExist(req.tag))) {
                        logger.warn("Otrzymane zapytanie o dodanie taga do zdjęcia zawiera tag, który nie istnieje. Odsyłam nulla.")
                        return response.end(null)
                    }
                    //właściwe dodawanie
                    response.end(JSON.stringify(
                        await imagesApiController.addTagToImage(id2, req.tag),
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
        default:
            logger.error("Przyszło zapytanie o nieobsługiwanej metodzie: ", request.method)
            response.end("404")
            break
    }
}

module.exports = router

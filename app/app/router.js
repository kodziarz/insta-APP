const path = require("path")
const fs = require("fs")
const logger = require('tracer').colorConsole()
const App = require("./App")

// załącz controller, utils , tablicę zwierząt

//const utils = require("./utils")
//const controller = require("./controller")

//const viewsPath = path.join(__dirname, "views")

const router = async (request, response) => {


    let app = new App()
    // obsługa zapytań

    //logger.debug("Przyszło zapytanie metodą: ", request.method)
    switch (request.method) {
        case "GET":
            switch (true) {
                case request.url == "/api/photos":
                    logger.info("Odebrano zapytanie o wysłanie wszystkich plików.")
                    response.end(JSON.stringify(
                        await app.sendAllFiles(request),
                        null,
                        5
                    ))
                    break
                case request.url.match(/\/api\/photos\/([0-9]+)/) != null:
                    let id = request.url.split("/")[3]
                    logger.info("Odebrano zapytanie o wysłanie pliku o id: ", id)
                    response.end(JSON.stringify(
                        await app.sendFileById(id, request),
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
                    let filesList = await app.loadFile(request)
                    response.end(JSON.stringify(filesList))
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
                        await app.deleteFileById(id, request),
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
                case request.url.match(/\/api\/photos\/([0-9]+)/) != null:
                    let id = request.url.split("/")[3]
                    logger.info("Odebrano zapytanie o edycję pliku o id: ", id)
                    response.end(JSON.stringify(
                        await app.editFileById(id, request),
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

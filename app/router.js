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


    switch (request.method) {
        case "GET":
            switch (true) {
                case request.url == "/api/photos":
                    response.end(JSON.stringify(
                        await app.sendAllFiles(request),
                        null,
                        5
                    ))
                    break
                case request.url.match(/\/api\/photos\/([0-9]+)/) != null:
                    let id = request.url.split("/")[3]
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
        default:
            logger.error("Przyszło zapytanie o nieobsługiwanej metodzie: ", request.method)
            response.end("404")
            break
    }
}

module.exports = router

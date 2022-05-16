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
                        app.sendAllFiles(request),
                        null,
                        5
                    ))
                    break
            }


        case "POST":
            switch (true) {
                case request.url == "/api/photos":

                    logger.info("odebrano zapytanie o zapisanie pliku")
                    let filesList = await app.loadFile(request)
                    response.end(JSON.stringify(filesList))
                    break
            }
            break;

    }
}

module.exports = router

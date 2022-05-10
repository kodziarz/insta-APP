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
                    response.end("legalne zapytanie")
                    break
            }


        case "POST":
            switch (true) {
                case request.url == "/api/photos":

                    let filesList = await app.loadFile(request)
                    response.end(JSON.stringify(filesList))
                    logger.log("odebrano plik")
                    break
            }
            break;

    }
}

module.exports = router

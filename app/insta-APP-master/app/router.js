const path = require("path")
const fs = require("fs")
const logger = require('tracer').colorConsole()
const RequestDataHandler = require("./RequestDataHandler");
const FilesController = require("./FilesController")

// załącz controller, utils , tablicę zwierząt

//const utils = require("./utils")
//const controller = require("./controller")

//const viewsPath = path.join(__dirname, "views")

const router = async (request, response) => {

    let filesController = new FilesController()
    let requestDataHandler = new RequestDataHandler()
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

                    let filesList = await filesController.handleFileUpload(request)
                    response.end(JSON.stringify(filesList))
                    logger.log("odebrano plik")
                    break
            }
            break;

    }
}

module.exports = router

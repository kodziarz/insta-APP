const RequestDataHandler = require("./app/RequestDataHandler");
const FilesController = require("./app/FilesController")
const JsonController = require("./app/JsonController");
const logger = require("tracer").colorConsole()


class App {
    //   klasa nadzoruje pracę całej aplikacji - rozdziala zadania po otrzumaniu zaputania z routera

    filesController
    requestDataHandler
    jsonController

    constructor() {
        this.filesController = new FilesController()
        this.requestDataHandler = new RequestDataHandler()
        this.jsonController = new JsonController()
    }

    loadFile = async (request) => {
        return new Promise(async (resolve) => {
            let data = await this.filesController.handleFileUpload(request)
            let files = data.files
            let fields = data.fields
            await this.jsonController.saveImageData(files, fields)
            resolve(files)
        })

    }

    sendAllFiles = async (request) => {
        return new Promise(async (resolve) => {
            let arrayToReturn = []
            this.jsonController.forEachFile((e) => {
                arrayToReturn.push(e)
            })
            logger.debug("arrayToReturn: ", arrayToReturn)
            resolve(arrayToReturn)
        })
    }

    sendFileById = async (id, request) => {
        return new Promise(async (resolve) => {
            resolve(await this.jsonController.getFileById(id))
        })
    }

    editFileById = async (id, request) => {
        return new Promise(async (resolve) => {
            this.jsonController.editFileById(id)
            resolve(undefined)
        })
    }

    deleteFileById = async (id, request) => {
        return new Promise(async (resolve) => {
            this.jsonController.deleteFileById(id)
            resolve(undefined)
        })
    }
}

module.exports = App
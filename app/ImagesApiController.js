//const RequestDataHandler = require("./RequestDataHandler");
const FilesController = require("./imagesApiController/FilesController")
const JsonController = require("./imagesApiController/JsonController");
const logger = require("tracer").colorConsole()

class ImagesApiController {
    //   klasa nadzoruje pracę całej aplikacji - rozdziala zadania po otrzumaniu zaputania z routera

    filesController
    //requestDataHandler
    jsonController

    constructor() {
        this.filesController = new FilesController()
        //this.requestDataHandler = new RequestDataHandler()
        this.jsonController = new JsonController()
    }

    init = async () => {
        await this.filesController.init()
    }

    loadFile = async (request) => {
        return new Promise(async (resolve) => {
            let data = await this.filesController.handleFileUpload(request)
            let files = data.files
            let fields = data.fields
            let imageData = await this.jsonController.saveImageData(files, fields)
            resolve(imageData)
        })

    }

    getAllFiles = async (request) => {
        return new Promise(async (resolve) => {
            let arrayToReturn = []
            this.jsonController.forEachFile((e) => {
                arrayToReturn.push(e)
            })
            resolve(arrayToReturn)
        })
    }

    getFileById = async (id, request) => {
        return new Promise(async (resolve) => {
            resolve(await this.jsonController.getFileById(id))
        })
    }

    editFileById = async (id, request) => {
        return new Promise(async (resolve) => {
            resolve(await this.jsonController.editFileById(id))
        })
    }

    deleteFileById = async (id, request) => {
        return new Promise(async (resolve) => {
            let deletedImageData = await this.jsonController.deleteFileById(id)
            let path = await this.jsonController.getFilePathById(deletedImageData.id)
            //dalsze czynności celowo nie są awaitowane, by nie hamować niepotrzebnie serwera - może poczekać xd
            this.filesController.deleteFile(path)
            this.jsonController.deleteFilePathToIdLink(deletedImageData.id)

            resolve(deletedImageData)
        })
    }

    addTagToImage = async (id, tagName) => {
        return new Promise(async (resolve) => {

            let modifiedImageData = await this.jsonController.addTagToImageData(id, tagName)
            logger.log("Dodano taga: ", tagName, " do obrazka o id: ", id)
            resolve(modifiedImageData)
        })
    }
}

module.exports = ImagesApiController
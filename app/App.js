const RequestDataHandler = require("./app/RequestDataHandler");
const FilesController = require("./app/FilesController")
const JsonController = require("./app/JsonController")

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
        let data = await this.filesController.handleFileUpload(request)
        let files = data.files
        let fields = data.fields
        this.jsonController.saveImageData(files, fields)
        return files
    }
}

module.exports = App
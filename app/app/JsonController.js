const logger = require("tracer").colorConsole()
const Model = require("./model")
const ImageData = require("./DataClasses/ImageData")

class JsonController {

    constructor() {

    }

    saveImageData = (files, fields) => {
        if (fields.album == undefined) {
            logger.error("Nie podano albumu zdjęcia.")
            return null
        }
        let modelObject = new ImageData(fields.album, "originalName", "https://xd").toJSON()
        Model.push(modelObject)
        ImageData.fromJSON(modelObject)
    }
}

module.exports = JsonController
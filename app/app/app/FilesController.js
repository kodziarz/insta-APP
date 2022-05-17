const formidable = require('formidable');
const logger = require("tracer").colorConsole()
const path = require("path")
const fs = require("fs").promises

class FilesController {

    static UPLOAD_DIR = "upload"
    static MAIN_DIR = __dirname

    constructor() {

    }

    handleFileUpload = async (request) => {

        return new Promise(async (resolve) => {
            let form = formidable({})
            form.uploadDir = FilesController.UPLOAD_DIR

            form.keepExtensions = true

            form.parse(request, function (err, fields, files) {

                //logger.log("otrzymane pola: ", fields)
                logger.log("plik zapisano pod ścieżką: ", files.file.path)

                resolve({ files: files, fields: fields })
            });
        })
    }

    readFile = async (path) => {
        return await fs.readDir(path)
    }
}

module.exports = FilesController
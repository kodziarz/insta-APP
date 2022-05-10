const formidable = require('formidable');
const logger = require("tracer").colorConsole()

class FilesController {

    static UPLOAD_DIR = "upload"

    constructor() {

    }

    handleFileUpload = async (request) => {

        return new Promise((resolve) => {
            let form = formidable({})
            form.uploadDir = FilesController.UPLOAD_DIR

            form.keepExtensions = true

            form.parse(request, function (err, fields, files) {

                logger.log("----- przesłane pola z formularza ------")
                logger.log(fields);

                logger.log("----- przesłane formularzem pliki ------");
                logger.log(files);

                resolve({ files: files, fields: fields })
            });
        })
    }
}

module.exports = FilesController
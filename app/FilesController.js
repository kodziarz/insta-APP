const formidable = require('formidable');

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

                console.log("----- przesłane pola z formularza ------");

                console.log(fields);

                console.log("----- przesłane formularzem pliki ------");

                console.log(files);

                resolve(files)
            });
        })
    }
}

module.exports = FilesController
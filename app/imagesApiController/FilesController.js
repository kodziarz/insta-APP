const formidable = require('formidable');
const logger = require("tracer").colorConsole()
const path = require("path")
const fsPromises = require("fs").promises
const fs = require("fs")

class FilesController {

    static UPLOAD_DIR = "upload"
    static MAIN_DIR = __dirname

    constructor() {

    }

    init = async () => {
        let createUploadDirPromise = this.#createUploadDir()

        await createUploadDirPromise
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

    readDir = async (path) => {
        return await fsPromises.readDir(path)
    }

    deleteFile = async (filePath) => {
        return new Promise(async (resolve) => {
            if (filePath == null) {
                logger.error("Otrzymano puste dane. Zwracam nulla.")
                return resolve(null)
            } else {
                try {
                    await fsPromises.unlink(filePath)
                    logger.log("Pomyślnie usunieto plik.")
                    return resolve(filePath)
                } catch (err) {
                    logger.error("Nie udało się usunąć pliku.")
                    console.error(err)
                    return resolve(null) // można by nie wypełnić tej obietnicy, by program nie wywalił się dalej
                }
            }
        })

    }

    #createUploadDir = async () => {
        if (fs.existsSync(FilesController.UPLOAD_DIR)) {
            logger.log("Folder uploadu istnieje.")
        } else {
            logger.warn("Nie odnaleziono folderu uploadu. Tworzę.")
            try {
                await fsPromises.mkdir(FilesController.UPLOAD_DIR)
                logger.log("Pomyślnie utworzono folder uploadu.")
            } catch (err) {
                logger.fatal("Nie udało się utworzyć folderu uploadu.")
                throw err
                // console.error(err)
            }
        }
    }
}

module.exports = FilesController
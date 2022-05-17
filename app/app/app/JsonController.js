const logger = require("tracer").colorConsole()
const Model = require("./model")
const ImageData = require("./DataClasses/ImageData")
const HistoryEntry = require("./DataClasses/HistoryEntry")

class JsonController {

    constructor() {

    }

    #getImageDataById = async (id) => {
        return new Promise(async (resolve) => {

            for (let e of Model) {
                if (e.id == id) {
                    return resolve(e)
                }
            }
            logger.error("Nie ma Pliku o takim id. Zwracam nulla.")
            console.trace()
            resolve(null)
        })
    }

    #indexOf = async (e) => {
        return new Promise(async (resolve) => {
            for (let i in Model) {
                if (e.id == Model[i].id) {
                    return resolve(i)
                }
            }
            logger.error("Nie znaleziono indeksu w tablicy danego elementu. Zwracam nulla.")
            console.trace()
            resolve(null)
        })
    }

    #deleteFileByIndex = async (index) => {
        //   metoda usuwa ImageData z Modela po indexie w Modelu

        let modelLength = Model.length
        delete Model[index]
        // przesuwanie elementów po usuniętym, by zachować ciągłość indeksacji tablicy
        for (let i = index + 1; i < modelLength; i++) {
            Model[i - 1] = Model[i]
        }
    }

    saveImageData = async (files, fields) => {
        return new Promise(async (resolve) => {
            if (fields.album == undefined) {
                logger.error("Nie podano albumu zdjęcia.")
                return null
            }
            let modelObject = new ImageData(fields.album, "originalName", "https://xd").toJSON()
            logger.log("ImageData nadano id: ", modelObject.id)
            Model.push(modelObject)
            ImageData.fromJSON(modelObject)
        })
    }

    getFileById = async (id) => {
        return new Promise(async (resolve) => {
            let imageData = { ...await this.#getImageDataById(id) }
            logger.log("Znaleziono dane obrazka")
            resolve(imageData)
        })
    }

    editFileById = async (id) => {
        return new Promise(async (resolve) => {
            let e = await this.#getImageDataById(id)
            let newE = ImageData.fromJSON(e)
            newE.addHistoryEntry()

            Model[await this.#indexOf(e)] = newE.toJSON()
            logger.log("Wyedytowano wpis w bazie na temat obrazka o id: ", newE.id)
            resolve(newE)
        })
    }

    deleteFileById = async (id) => {
        return new Promise(async (resolve) => {
            let e = await this.#getImageDataById(id)
            let index = await this.#indexOf(e)
            logger.debug("Znaleziono index: ", index, " dla e: ", e)
            this.#deleteFileByIndex(index)
            logger.log("Usunięto z bazy dane obrazka o id: ", e.id)
            resolve(e)
        })
    }

    forEachFile = async (change) => {
        return new Promise(async (resolve) => {
            if (!(change instanceof Function)) {
                logger.error("metoda forEachFile nie dostała funkcji w parametrze. Zwracam nulla.")
                resolve(null)
            }
            Model.forEach(change)
            resolve(undefined)
        })
    }
}

module.exports = JsonController
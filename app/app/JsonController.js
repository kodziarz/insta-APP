const logger = require("tracer").colorConsole()
const Model = require("./model")
const ImageData = require("./DataClasses/ImageData")
const { resolve } = require("path/posix")
const HistoryEntry = require("./DataClasses/HistoryEntry")
const { resolveSoa } = require("dns")

class JsonController {

    constructor() {

    }

    #getImageDataById = async (id) => {
        return new Promise(async (resolve) => {
            Model.forEach((e) => {
                if (e.id == id)
                    resolve(e)
            })
            logger.error("Nie ma Pliku o takim id. Zwracam nulla.")
            resolve(null)
        })
    }

    #indexOf = async (e) => {
        return new Promise(async (resolve) => {
            this.forEachFile((e, i) => {
                if (e.id == e.id) {
                    resolve(i)
                }
            })
            logger.error("Nie znaleziono indeksu w tablicy danego elementu. Zwracam nulla.")
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
            Model.push(modelObject)
            ImageData.fromJSON(modelObject)
        })
    }

    getFileById = async (id) => {
        return new Promise(async (resolve) => {
            resolve({ ...this.#getImageDataById(id) })
        })
    }

    editFileById = async (id) => {
        return new Promise(async (resolve) => {
            let e = this.#getImageDataById(id)
            let newE = ImageData.fromJSON(e)
            newE.addHistoryEntry()

            Model[this.#indexOf(e)] = newE.toJSON()
        })
    }

    deleteFileById = async (id) => {
        return new Promise(async (resolve) => {
            let e = this.#getImageDataById(id)
            let index = this.#indexOf(e)
            this.#deleteFileByIndex(index)
        })
    }

    forEachFile = async (change) => {
        return new Promise(async (resolve) => {
            if (!(change instanceof Function)) {
                logger.error("metoda forEachFile nie dostała funkcji w parametrze. Zwracam nulla.")
                resolve(null)
            }
            Model.forEach(change(e, i, org))
            resolve(undefined)
        })
    }
}

module.exports = JsonController
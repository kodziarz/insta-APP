const logger = require("tracer").colorConsole()
const { ImageDatasArray, ImagePathsById } = require("./model")
const ImageData = require("../DataClasses/ImageData")
const HistoryEntry = require("../DataClasses/HistoryEntry")

class JsonController {

    constructor() {

    }

    #getImageDataById = async (id) => {
        return new Promise(async (resolve) => {

            for (let e of ImageDatasArray) {
                if (e.id == id) {
                    return resolve(e)
                }
            }
            logger.warn("Nie ma Pliku o takim id. Zwracam nulla.")
            resolve(null)
        })
    }

    #indexOf = async (e) => {
        return new Promise(async (resolve) => {
            for (let i in ImageDatasArray) {
                if (e.id == ImageDatasArray[i].id) {
                    return resolve(i)
                }
            }
            logger.error("Nie znaleziono indeksu w tablicy danego elementu. Zwracam nulla.")
            console.trace()
            resolve(null)
        })
    }

    #deleteFileByIndex = async (index) => {
        //   metoda usuwa ImageData z ImageDatasArraya po indexie w ImageDatasArrayu

        let arraysLength = ImageDatasArray.length
        delete ImageDatasArray[index]
        // przesuwanie elementów po usuniętym, by zachować ciągłość indeksacji tablicy
        for (let i = parseInt(index) + 1; i < arraysLength; i++) {
            ImageDatasArray[i - 1] = ImageDatasArray[i]
        }
        ImageDatasArray.length--
    }

    saveImageData = async (files, fields) => {
        return new Promise(async (resolve) => {
            if (fields.album == undefined) {
                logger.error("Nie podano albumu zdjęcia.")
                return null
            }
            // dodawanie imageData do ImageDatasArray
            let objectForArray = new ImageData(fields.album, "originalName", "https://xd").toJSON()
            logger.log("ImageData nadano id: ", objectForArray.id)
            ImageDatasArray.push(objectForArray)
            // dodawanie powiązania id ImageData ze ścieżką do pliku
            ImagePathsById[objectForArray.id] = files.file.path

            resolve(objectForArray)
        })
    }

    getFileById = async (id) => {
        return new Promise(async (resolve) => {
            let imageData = { ...await this.#getImageDataById(id) }
            if (imageData != null || imageData != undefined) {
                logger.log("Znaleziono dane obrazka o id: ", imageData.id)
                resolve(imageData)
            } else {
                logger.warn("Nie znaleziono danych obrazka o id: ", id, ". Zwracam nulla.")
                resolve(null)
            }
        })
    }

    editFileById = async (id) => {
        return new Promise(async (resolve) => {
            let e = await this.#getImageDataById(id)
            if (e != null) {
                let newE = ImageData.fromJSON(e)
                newE.addHistoryEntry()

                ImageDatasArray[await this.#indexOf(e)] = newE.toJSON()
                logger.log("Wyedytowano wpis w bazie na temat obrazka o id: ", newE.id)
                resolve(newE)

            } else {
                logger.warn("Nie znaleziono elementu o danym id, wobec czego edycja nie została dokonana. Zwracam nulla.")
                resolve(null)
            }

        })
    }

    deleteFileById = async (id) => {
        return new Promise(async (resolve) => {
            let e = await this.#getImageDataById(id)
            if (e != null) {
                let index = await this.#indexOf(e)
                this.#deleteFileByIndex(index)
                logger.log("Usunięto z bazy dane obrazka o id: ", e.id)
                resolve(e)
            } else {
                logger.warn("Nie znaleziono elementu o danym id, wobec czego obrazek nie został usunięty. Zwracam nulla.")
                resolve(null)
            }
        })
    }

    getFilePathById = async (id) => {
        return new Promise(async (resolve) => {
            if (id == null || id == undefined) {
                logger.error("Otrzymano jako paratemr nulla/undefineda. Zwrcam nulla.")
                return resolve(null)
            }
            let result = ImagePathsById[id]
            if (result == undefined || result == null) {
                logger.error("Nie ma powiązania pomiędzy id a ścieżką pliku dla id: ", id, ". Zwracam nulla.")
                return resolve(null)
            }
            return resolve(result)
        })
    }

    deleteFilePathToIdLink = async (id) => {
        return new Promise(async (resolve) => {
            if (id == null || id == undefined) {
                logger.error("Otrzymano jako paratemr nulla/undefineda. Zwrcam nulla.")
                return resolve(null)
            }
            let result = ImagePathsById[id]
            delete ImagePathsById[id]
            return resolve(result)
        })
    }

    addTagToImageData = async (imageId, tagName) => {
        return new Promise(async (resolve) => {
            let imageData = await this.#getImageDataById(imageId)
            // zabezpieczenie
            if (imageData == null) {
                logger.warn("Nie ma obrazka o takim id. Zwracam nulla.")
                return resolve(null)
            }
            imageData.tags.push(tagName)
            return resolve(imageData)
        })
    }

    getTagsOfImage = async (id) => {
        return new Promise(async (resolve) => {

            let imageData = await this.#getImageDataById(id)
            resolve(imageData.tags)
        })
    }

    forEachFile = async (change) => {
        return new Promise(async (resolve) => {
            if (!(change instanceof Function)) {
                logger.error("metoda forEachFile nie dostała funkcji w parametrze. Zwracam nulla.")
                return resolve(null)
            }
            ImageDatasArray.forEach(change)
            resolve(undefined)
        })
    }
}

module.exports = JsonController
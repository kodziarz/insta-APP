const logger = require('tracer').colorConsole()

const Tag = require('./Tag')
const HistoryEntry = require("./HistoryEntry")
class ImageData {
    id
    album
    originalName
    url
    lastChange
    history = []
    tags = []

    constructor(album, originalName, url) {
        this.id = new Date().getTime()
        this.album = album
        this.originalName = originalName
        this.url = url
        this.lastChange = "original"
        this.history.push(new HistoryEntry(HistoryEntry.STATUSES.ORIGINAL))
    }

    toJSON = () => {
        //   funkcja eksportuje obiekt klasy ImageData do postaci do zapisu w Modelu (tudzież innej bazie danych)
        // przelatuje po wszystkich polach swojego obiektu i sprawdza, czy nie są funkcjami
        let resultObject = Object.fromEntries(Object.entries(this).filter(([key, value]) => {
            if (value instanceof Function)
                return false
            return true
        }))
        // przekonwertowanie obiektów klasy HistoryEntry
        resultObject.history = resultObject.history.map((value, index) => {
            if (value instanceof HistoryEntry)
                return value.toJSON()
            else {
                logger.error("w tablicy przechowującej historię (pole history obiektu klasy ImageData znalazła się wartość: ", value, ", która nie jest klasy HistoryEntry -> zwracam nulla")
                return null
            }
        })
        // przekonwertowanie obiektów klasy Tag
        // resultObject.tags = resultObject.history.map((value, index) => {
        //     if (value instanceof Tag)
        //         return value.toJSON()
        //     else {
        //         logger.error("w tablicy przechowującej tagi (pole tags obiektu klasy ImageData znalazła się wartość: ", value, ", która nie jest klasy Tag -> zwracam nulla")
        //         return null
        //     }
        // })

        return resultObject
    }

    static fromJSON = (json) => {
        let finalObject = new ImageData(json.album, json.originalName, json.url);

        Object.entries(json).forEach(([key, value]) => {
            //logger.debug("value: ", value, " key: ", key)
            finalObject[key] = value
        })

        for (let i in finalObject.history) {
            finalObject.history[i] = HistoryEntry.fromJSON(finalObject.history[i])
        }

        // for (let i in finalObject.tags) {
        //     finalObject.tags[i] = HistoryEntry.fromJSON(finalObject.tags[i])
        // }
        return finalObject
    }

    addHistoryEntry = () => {
        this.history.push(new HistoryEntry(HistoryEntry.STATUSES.CHANGED))
    }
}

module.exports = ImageData
const logger = require('tracer').colorConsole()

class HistoryEntry {
    //   klasa konstytuuje kształt wpisu historii obrazka

    static STATUSES = {
        ORIGINAL: "original",
        CHANGED: "changed"
    }

    status
    lastModifiedDate

    constructor(status) {

        // status
        for (let possibleStatus of Object.values(HistoryEntry.STATUSES)) {
            if (status == possibleStatus) {
                this.status = status
                break
            }
        }
        if (this.status == undefined) {
            logger.error("Podany argument konstruktorowi klasy HistoryEntry nie jest statusem z HistoryEntry.STATUSES.")
            return null
        }

        this.lastModifiedDate = new Date().getTime()
    }

    toJSON = () => {
        return Object.fromEntries(Object.entries(this).filter(([key, value]) => {
            if (value instanceof Function)
                return false
            return true
        }))
    }
}

module.exports = HistoryEntry
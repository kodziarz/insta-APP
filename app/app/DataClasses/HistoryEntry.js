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
        for (let possibleStatus in HistoryEntry.STATUSES) {
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
        return {
            status: this.status,
            lastModifiedDate: this.lastModifiedDate
        }
    }
}

module.exports = HistoryEntry
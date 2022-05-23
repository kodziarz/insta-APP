const logger = require("tracer").colorConsole()

class Tag {

    static EXCEPIONS = {
        WRONG_NAME: "wrong name of tag"
    }

    static isTagsException = (exception) => {
        return !Object.values(Tag.EXCEPIONS).every((e) => {
            return exception.status != e
        })
    }

    static NEXT_ID = 0

    id
    name
    popularity

    constructor(name) {
        if (name.includes(" "))
            throw { status: Tag.EXCEPIONS.WRONG_NAME, message: "W konstruktorze podano nazwę tagu zawierającą niepoprawne znaki." }
        this.id = Tag.NEXT_ID++
        this.name = name[0] == "#" ? name : "#" + name
        this.popularity = Math.round(Math.random() * 100000)
    }

    toJSON = () => {
        //   funkcja eksportuje obiekt klasy Tag do postaci do zapisu w Modelu (tudzież innej bazie danych)
        // przelatuje po wszystkich polach swojego obiektu i sprawdza, czy nie są funkcjami
        let resultObject = Object.fromEntries(Object.entries(this).filter(([key, value]) => {
            if (value instanceof Function)
                return false
            return true
        }))
        return resultObject
    }

    static fromJSON = (json) => {
        let finalObject = new Tag(json.name);

        Object.entries(json).forEach(([key, value]) => {
            //logger.debug("value: ", value, " key: ", key)
            finalObject[key] = value
        })
        return finalObject
    }
}

module.exports = Tag
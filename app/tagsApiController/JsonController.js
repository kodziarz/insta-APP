const { TagsNamesArray, TagsArray } = require("./model")
const Tag = require("../DataClasses/Tag")
const logger = require("tracer").colorConsole()

class JsonController {
    constructor() {
        this.#createTagsObjectsFromTagsNamesArray()
    }

    getAllTagsNames = async () => {
        return new Promise(async (resolve) => {
            return resolve(TagsNamesArray)
        })
    }

    getAllTags = async () => {
        return new Promise(async (resolve) => {
            return resolve(TagsArray)
        })
    }

    getTagById = async (id) => {
        return new Promise(async (resolve) => {
            return resolve(TagsArray[id])
        })
    }

    createTag = async (name) => {
        return new Promise(async (resolve) => {
            try {
                let tag = new Tag(name).toJSON()
                TagsArray.push(tag)
                TagsNamesArray.push(tag.name)
                logger.log("Zapisano taga: ", tag.name)
                return resolve(tag)

            } catch (error) {

                if (Tag.isTagsException(error)) {
                    logger.warn(error.message)
                    logger.log("Zwracam nulla.")
                    return resolve(null)
                } else throw error
            }
        })
    }

    doesTagExist = async (tagName) => {
        return new Promise(async (resolve) => {
            TagsNamesArray.every((e) => {
                if (e == tagName) {
                    resolve(true)
                    return false
                }
                return true
            })
            resolve(false)
        })
    }

    #createTagsObjectsFromTagsNamesArray = () => {
        TagsNamesArray.forEach((e) => {
            let tag = new Tag(e)
            TagsArray.push(tag.toJSON())
        })
    }
}

module.exports = JsonController
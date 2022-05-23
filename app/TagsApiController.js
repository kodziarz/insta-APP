const JsonController = require("./tagsApiController/JsonController")

class TagsApiController {

    #jsonController

    constructor() {
        this.#jsonController = new JsonController()
    }

    getAllTagsNames = async () => {
        return new Promise(async (resolve) => {
            return resolve(await this.#jsonController.getAllTagsNames())
        })
    }

    getAllTags = async () => {
        return new Promise(async (resolve) => {
            return resolve(await this.#jsonController.getAllTags())
        })
    }

    getTagById = async (id) => {
        return new Promise(async (resolve) => {
            return resolve(await this.#jsonController.getTagById(id))
        })
    }

    createTag = async (name) => {
        return new Promise(async (resolve) => {
            return resolve(await this.#jsonController.createTag(name))
        })
    }

    doesTagExist = async (tagName) => {
        return new Promise(async (resolve) => {
            return resolve(await this.#jsonController.doesTagExist(tagName))
        })
    }
}

module.exports = TagsApiController
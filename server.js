const logger = require('tracer').colorConsole()
const http = require('http');
const imagesRouter = require("./app/imagesRouter")
const tagsRouter = require("./app/tagsRouter")
const ImagesApiController = require("./app/ImagesApiController")
const TagsApiController = require("./app/TagsApiController")
const PORT = 3000

let imagesApiController = new ImagesApiController()
let tagsApiController = new TagsApiController()

http
    .createServer(async (req, res) => {
        switch (true) {
            case req.url.search("/api/photos") != -1:
                await imagesRouter(req, res, imagesApiController, tagsApiController)
                break
            case req.url.search("/api/tags") != -1:
                await tagsRouter(req, res, tagsApiController)
                break
        }
    })
    .listen(PORT, async () => {
        await imagesApiController.init()
        logger.info("Serwer wystratował na porcie: ", PORT)
    })

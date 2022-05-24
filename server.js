const logger = require('tracer').colorConsole()
const http = require('http');
const dotenv = require("dotenv")
const imagesRouter = require("./app/imagesRouter")
const tagsRouter = require("./app/tagsRouter")
const userRouter = require("./app/userRouter")
const ImagesApiController = require("./app/ImagesApiController")
const TagsApiController = require("./app/TagsApiController")
const UserApiController = require("./app/UserApiController")
const PORT = 3000

dotenv.config()

let imagesApiController = new ImagesApiController()
let tagsApiController = new TagsApiController()
let userApiController = new UserApiController()

http
    .createServer(async (req, res) => {
        switch (true) {
            case req.url.search("/api/photos") != -1:
                await imagesRouter(req, res, imagesApiController, tagsApiController)
                break
            case req.url.search("/api/tags") != -1:
                await tagsRouter(req, res, tagsApiController)
                break
            case req.url.search("/api/user") != -1:
                await userRouter(req, res, userApiController)
                break
        }
    })
    .listen(PORT, async () => {
        await imagesApiController.init()
        logger.info("Serwer wystratował na porcie: ", PORT)
    })

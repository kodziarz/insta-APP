const logger = require("tracer").colorConsole()

class RequestDataHandler {

    constructor() {

    }

    static getRequestPromise = async (request) => {
        return new Promise((resolve) => {
            let body = "";

            request.on("data", function (data) {
                body += data.toString();
            })

            request.on("end", function (data) {
                if (body != undefined) {
                    let obj = JSON.parse(body)
                    logger.log("Odebrano dane: ", obj)
                    resolve(obj)
                } else {
                    resolve(null)
                }

            })
        })
    }


}

module.exports = RequestDataHandler
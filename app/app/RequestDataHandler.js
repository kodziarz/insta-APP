class RequestDataHandler {

    constructor() {

    }

    getRequestPromise = async (request) => {
        return new Promise((resolve) => {
            let body = "";

            request.on("data", function (data) {
                console.log("data: " + data)
                body += data.toString();
            })

            request.on("end", function (data) {
                if (body != undefined) {
                    let obj = JSON.parse(body)
                    resolve(obj)
                } else {
                    resolve(null)
                }

            })
        })
    }

    
}

module.exports = RequestDataHandler
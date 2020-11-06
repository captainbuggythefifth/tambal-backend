import { APIGatewayProxyEvent } from "aws-lambda"

const bodyParser = <T>(event: APIGatewayProxyEvent): false | T => {
    
    if (!event || !event.body) {
        return false
    }

    if (typeof event.body === "string") {
        return JSON.parse(event.body)
    }

    return event.body
    
}

export {
    bodyParser
}
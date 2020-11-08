import { APIGatewayProxyEvent } from "aws-lambda"

const validateEventQueryStringNumber = (queryString: string, event: APIGatewayProxyEvent) => {

    const isValid = event.queryStringParameters &&
        event.queryStringParameters[queryString] &&
        Number.isInteger(Number(event.queryStringParameters[queryString])) ? true : false

    return isValid
}

export {
    validateEventQueryStringNumber
}
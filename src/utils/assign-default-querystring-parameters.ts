import { APIGatewayProxyEvent } from "aws-lambda";
import { findOptionsDefaultParameters } from "./../interfaces/find-options";
import { validateEventQueryStringNumber } from "./validate-event-querystring-number";

const assignDefaultEventQueryStringParameters = (event: APIGatewayProxyEvent) => {
    const defaultParameters = findOptionsDefaultParameters;

    let parameters = {
        ...defaultParameters,
        ...event.queryStringParameters,
    }

    // page and limit must be Number if given
    const validPage = validateEventQueryStringNumber('page', event);
    const validLimit = validateEventQueryStringNumber('limit', event);

    // we must override the defaults if there are given values from event.queryStringParameters
    
    // page is valid, we must override the page from parameters; otherwise, set to default
    if (validPage) {
        parameters = {
            ...parameters,
            page: event.queryStringParameters && event.queryStringParameters.page ? Number(event.queryStringParameters.page) : defaultParameters.page,
        }
    }

    // limit is valid, we must override the limit from parameters; otherwise, set to default
    if (validLimit) {
        parameters = {
            ...parameters,
            limit: event.queryStringParameters && event.queryStringParameters.limit ? Number(event.queryStringParameters.limit) : defaultParameters.limit,
        }
    }

    return parameters
}

export {
    assignDefaultEventQueryStringParameters
}
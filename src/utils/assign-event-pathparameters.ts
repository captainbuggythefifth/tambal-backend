import { APIGatewayProxyEvent } from "aws-lambda";

const assignEventPathParameters = (path: string, event: APIGatewayProxyEvent) => {
    const pathParam = event.pathParameters && event.pathParameters[path] ? event.pathParameters[path] : undefined;
    return pathParam
};

export {
    assignEventPathParameters
}
import {
    APIGatewayProxyEvent,
    APIGatewayProxyResult
} from "aws-lambda";
import { StatusCodes } from 'http-status-codes';
import { Maintenance } from './models/maintenance';
import { bodyParser } from './utils/body-parser';
import { validateParameters } from "./utils/validate-parameters";
import { validateMongooseID } from "./utils/validate-mongoose-id";
import { lambdaResponse } from "./utils/lambda-response";
import MaintenanceController from './controllers/maintenance';

import { connect, disconnect } from './connect';
import { assignDefaultEventQueryStringParameters } from "./utils/assign-default-querystring-parameters";
import { assignEventPathParameters } from "./utils/assign-event-pathparameters";
connect();

export async function create(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {

    // required parameters
    const parameters = [
        'owner',
        'stocks',
        'medicines',
        'schedule'
    ];

    // must parse the body. If run locally, event.body is in json format; otherwise it is string
    const body = bodyParser<Maintenance>(event);

    // must reject the request if the body is not present
    if (!body) {
        return lambdaResponse({
            statusCode: StatusCodes.BAD_REQUEST,
            message: 'Must have body'
        });
    }

    // validate all the parameters
    const validParams = validateParameters(body, parameters);

    if (!validParams) {
        return lambdaResponse({
            statusCode: StatusCodes.BAD_REQUEST,
            message: 'Must have parameters'
        });
    }

    // validate medicines
    if (!Array.isArray(body.medicines)) {
        return lambdaResponse({
            statusCode: StatusCodes.BAD_REQUEST,
            message: 'medicines must be array'
        });
    }

    // validate schedule
    if (!body.schedule.every || !body.schedule.frequency) {
        return lambdaResponse({
            statusCode: StatusCodes.BAD_REQUEST,
            message: 'schedule must be in { every: string, frequency: number }'
        });
    }

    const maintenance = await MaintenanceController.create(body);

    return lambdaResponse({
        statusCode: StatusCodes.CREATED,
        message: 'Successfully created',
        data: maintenance
    });
};

export async function find(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {

    // must assign the default parameters and override if event.queryStringParameters are present
    const parameters = assignDefaultEventQueryStringParameters(event)

    const maintenances = await MaintenanceController.find(parameters);

    disconnect();

    return lambdaResponse({
        statusCode: StatusCodes.OK,
        message: 'maintenances',
        data: maintenances,
        // data: finalItems,
        page: parameters.page,
        limit: parameters.limit
    });
};

export async function findByID(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {

    // validate id from event.pathParameters
    const id = assignEventPathParameters('id', event);

    if (!id) {
        return lambdaResponse({
            statusCode: StatusCodes.BAD_REQUEST,
            message: 'Must have path parameter id'
        });
    }

    // validate id if mongoose format Object ID
    const isValidID = validateMongooseID(id);

    if (!isValidID) {
        return lambdaResponse({
            statusCode: StatusCodes.BAD_REQUEST,
            message: 'ID is not valid'
        });
    }

    const maintenance = await MaintenanceController.findById(id);

    if (!maintenance) {
        return lambdaResponse({
            statusCode: StatusCodes.NOT_FOUND,
            message: 'No match'
        });
    }

    disconnect()

    return lambdaResponse({
        statusCode: StatusCodes.OK,
        message: 'maintenance',
        data: maintenance,
    });
};

export async function update(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {

    // validate id from event.pathParameters
    const id = assignEventPathParameters('id', event);

    if (!id) {
        return lambdaResponse({
            statusCode: StatusCodes.BAD_REQUEST,
            message: 'Must have path parameter id'
        });
    }

    const isValidID = validateMongooseID(id);

    if (!isValidID) {
        return lambdaResponse({
            statusCode: StatusCodes.BAD_REQUEST,
            message: 'ID is not valid'
        });
    }

    const body = bodyParser<Maintenance>(event);

    // must reject the request if the body is not present
    if (!body) {
        return lambdaResponse({
            statusCode: StatusCodes.BAD_REQUEST,
            message: 'Must have body'
        });
    }

    // must validate if the ID passed is legit
    const maintenance = await MaintenanceController.findById(id);

    if (!maintenance) {
        return lambdaResponse({
            statusCode: StatusCodes.NOT_FOUND,
            message: 'No match'
        });
    }

    const updated = await MaintenanceController.update(id, body);

    disconnect()

    return lambdaResponse({
        statusCode: StatusCodes.OK,
        message: 'Successfully updated',
        data: updated
    });
};
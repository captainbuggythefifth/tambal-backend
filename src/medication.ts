import {
    APIGatewayProxyEvent,
    APIGatewayProxyResult
} from "aws-lambda";
import { StatusCodes } from 'http-status-codes';
import { Medication } from './models/medication';
import { bodyParser } from './utils/body-parser';
import { validateParameters } from "./utils/validate-parameters";
import { validateMongooseID } from "./utils/validate-mongoose-id";
import { lambdaResponse } from "./utils/lambda-response";
import MedicationController from './controllers/medication';

import { connect, disconnect } from './connect';
import { assignDefaultEventQueryStringParameters } from "./utils/assign-default-querystring-parameters";
import { assignEventPathParameters } from "./utils/assign-event-pathparameters";
import { FindOptions } from "./interfaces/find-options";

connect();

interface MedicationFind extends FindOptions {
    owner: string,
}

export async function create(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {

    // required parameters
    const parameters = [
        'owner',
        'stocks',
        'medicines',
        'schedule'
    ];

    // must parse the body. If run locally, event.body is in json format; otherwise it is string
    const body = bodyParser<Medication>(event);

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

    const medication = await MedicationController.create(body);

    // disconnect();;

    return lambdaResponse({
        statusCode: StatusCodes.CREATED,
        message: 'Successfully created',
        data: medication
    });
};

export async function find(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {

    // must assign the default parameters and override if event.queryStringParameters are present
    const parameters = assignDefaultEventQueryStringParameters(event) as MedicationFind;

    // if parameters.owner has value, we must check if mongoose format Object ID
    if (parameters.owner && parameters.owner !== null) {
        const isValid = validateMongooseID(parameters.owner);

        if (!isValid) {
            return lambdaResponse({
                statusCode: StatusCodes.BAD_REQUEST,
                message: 'owner is not valid'
            });
        }
    }

    const medications = await MedicationController.find(parameters);

    // disconnect();;

    return lambdaResponse({
        statusCode: StatusCodes.OK,
        message: 'medications',
        data: medications,
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

    const medication = await MedicationController.findById(id);

    if (!medication) {
        return lambdaResponse({
            statusCode: StatusCodes.NOT_FOUND,
            message: 'No match'
        });
    }

    // disconnect();

    return lambdaResponse({
        statusCode: StatusCodes.OK,
        message: 'medication',
        data: medication,
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

    const body = bodyParser<Medication>(event);

    // must reject the request if the body is not present
    if (!body) {
        return lambdaResponse({
            statusCode: StatusCodes.BAD_REQUEST,
            message: 'Must have body'
        });
    }

    // must validate if the ID passed is legit
    const medication = await MedicationController.findById(id);

    if (!medication) {
        return lambdaResponse({
            statusCode: StatusCodes.NOT_FOUND,
            message: 'No match'
        });
    }

    const updated = await MedicationController.update(id, body);

    // disconnect();

    return lambdaResponse({
        statusCode: StatusCodes.OK,
        message: 'Successfully updated',
        data: updated
    });
};
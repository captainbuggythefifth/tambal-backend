import {
    APIGatewayProxyEvent,
    APIGatewayProxyResult
} from "aws-lambda";
import { StatusCodes } from 'http-status-codes';
import { Patient } from "./models/patient";
import { bodyParser } from './utils/body-parser';
import { validateParameters } from "./utils/validate-parameters";
import { validateMongooseID } from "./utils/validate-mongoose-id";
import { lambdaResponse } from "./utils/lambda-response";
import PatientController from './controllers/patient';

import { connect, disconnect } from './connect';
import { assignDefaultEventQueryStringParameters } from "./utils/assign-default-querystring-parameters";
import { assignEventPathParameters } from "./utils/assign-event-pathparameters";
import { FindOptions } from "./interfaces/find-options";

connect();

interface PatientFind extends FindOptions {
    owner: string,
    patient: string,
}

export async function create(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {

    // required parameters
    const parameters = [
        'owner',
        'organizers',
        'patient',
        'maintenances',
    ];

    // must parse the body. If run locally, event.body is in json format; otherwise it is string
    const body = bodyParser<Patient>(event);

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

    // validate organizers
    if (!Array.isArray(body.organizers)) {
        return lambdaResponse({
            statusCode: StatusCodes.BAD_REQUEST,
            message: 'organizers must be array'
        });
    }

    // validate organizers
    if (!Array.isArray(body.maintenances)) {
        return lambdaResponse({
            statusCode: StatusCodes.BAD_REQUEST,
            message: 'maintenances must be array'
        });
    }

    const maintenance = await PatientController.create(body);

    disconnect();

    return lambdaResponse({
        statusCode: StatusCodes.CREATED,
        message: 'Successfully created',
        data: maintenance
    });
};

export async function find(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {

    // must assign the default parameters and override if event.queryStringParameters are present
    const parameters = assignDefaultEventQueryStringParameters(event) as PatientFind;

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

    // if parameters.patient has value, we must check if mongoose format Object ID
    if (parameters.patient && parameters.patient !== null) {
        const isValid = validateMongooseID(parameters.patient);

        if (!isValid) {
            return lambdaResponse({
                statusCode: StatusCodes.BAD_REQUEST,
                message: 'patient is not valid'
            });
        }
    }

    const patients = await PatientController.find(parameters);

    disconnect();

    return lambdaResponse({
        statusCode: StatusCodes.OK,
        message: 'patients',
        data: patients,
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

    const patient = await PatientController.findById(id);

    if (!patient) {
        return lambdaResponse({
            statusCode: StatusCodes.NOT_FOUND,
            message: 'No match'
        });
    }

    disconnect()

    return lambdaResponse({
        statusCode: StatusCodes.OK,
        message: 'patient',
        data: patient,
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

    const body = bodyParser<Patient>(event);

    // must reject the request if the body is not present
    if (!body) {
        return lambdaResponse({
            statusCode: StatusCodes.BAD_REQUEST,
            message: 'Must have body'
        });
    }

    // must validate if the ID passed is legit
    const paitient = await PatientController.findById(id);

    if (!paitient) {
        return lambdaResponse({
            statusCode: StatusCodes.NOT_FOUND,
            message: 'No match'
        });
    }

    const updated = await PatientController.update(id, body);

    disconnect()

    return lambdaResponse({
        statusCode: StatusCodes.OK,
        message: 'Successfully updated',
        data: updated
    });
};
import {
    APIGatewayProxyEvent,
    APIGatewayProxyResult
} from "aws-lambda";
import { StatusCodes } from 'http-status-codes';
import { Medicine } from './models/medicine';
import { bodyParser } from './utils/body-parser';
import { validateParameters } from "./utils/validate-parameters";
import { validateMongooseID } from "./utils/validate-mongoose-id";
import { lambdaResponse } from "./utils/lambda-response";
import MedicineController from './controllers/medicine';

import { connect, disconnect } from './connect';
import { assignDefaultEventQueryStringParameters } from "./utils/assign-default-querystring-parameters";
import { assignEventPathParameters } from "./utils/assign-event-pathparameters";
import { FindOptions } from "./interfaces/find-options";

connect();

interface MedicineFind extends FindOptions {
    owner: string
}

export async function create(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    
    // required parameters
    const parameters = [
        'owner',
        'genericName',
        'brandName',
        'metrology',
    ];

    // must parse the body. If run locally, event.body is in json format; otherwise it is string
    const body = bodyParser<Medicine>(event);

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

    const medicine = await MedicineController.create(body);
    
    // disconnect();;

    return lambdaResponse({
        statusCode: StatusCodes.CREATED,
        message: 'Successfully created',
        data: medicine
    });
};

export async function find(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    
    // must assign the default parameters and override if event.queryStringParameters are present
    const parameters = assignDefaultEventQueryStringParameters(event) as MedicineFind;

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

    const medicines = await MedicineController.find(parameters);

    // disconnect();;

    return lambdaResponse({
        statusCode: StatusCodes.OK,
        message: 'Medicines',
        data: medicines,
        page: parameters.page,
        limit: parameters.limit
    });
};

export async function findByID(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    
    // validate id from event.pathParameters
    const id = assignEventPathParameters('id', event)

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

    const medicine = await MedicineController.findById(id);

    // disconnect();;

    if (!medicine) {
        return lambdaResponse({
            statusCode: StatusCodes.NOT_FOUND,
            message: 'No match'
        });
    }

    return lambdaResponse({
        statusCode: StatusCodes.OK,
        message: 'Medicine',
        data: medicine,
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

    const body = bodyParser<Medicine>(event);

    if (!body) {
        return lambdaResponse({
            statusCode: StatusCodes.BAD_REQUEST,
            message: 'Must have body'
        });
    }

    // must validate if the ID passed is legit
    const medicine = await MedicineController.findById(id);

    if (!medicine) {
        return lambdaResponse({
            statusCode: StatusCodes.NOT_FOUND,
            message: 'No match'
        });
    }

    const updated = await MedicineController.update(id, body);

    // disconnect();;
    
    return lambdaResponse({
        statusCode: StatusCodes.OK,
        message: 'Successfully updated',
        data: updated
    });
};
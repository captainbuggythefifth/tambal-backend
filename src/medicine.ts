import {
    APIGatewayProxyEvent,
    APIGatewayProxyResult
} from "aws-lambda";
import { StatusCodes } from 'http-status-codes';
import { Medicine } from './models/medicine';
import { bodyParser } from './utils/body-parser';
import { connect } from './connect';
import { validateParameters } from "./utils/validate-parameters";
import { validateMongooseID } from "./utils/validate-mongoose-id";
import { lambdaResponse } from "./utils/lambda-response";
import MedicineController from './controllers/medicine';

connect();

export async function create(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    const parameters = [
        'owner',
        'genericName',
        'brandName',
        'metrology',
    ];

    let body = bodyParser<Medicine>(event);

    if (!body) {
        return lambdaResponse({
            statusCode: StatusCodes.BAD_REQUEST,
            message: 'Must have body'
        });
    }

    const validParams = validateParameters(body, parameters);

    if (!validParams) {
        return lambdaResponse({
            statusCode: StatusCodes.BAD_REQUEST,
            message: 'Must have parameters'
        });
    }

    const medicine = await MedicineController.create(body);
    
    return lambdaResponse({
        statusCode: StatusCodes.OK,
        message: 'Successfully created',
        data: medicine
    });
};

export async function find(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    const defaultParameters = {
        'page': 0,
        'limit': 10
    };
    // we must override the defaults if there are given values
    const parameters = {
        ...defaultParameters,
        ...event.queryStringParameters,
    }

    const medicines = await MedicineController.find(parameters);

    return lambdaResponse({
        statusCode: StatusCodes.OK,
        message: 'Medicines',
        data: medicines,
        page: parameters.page,
        limit: parameters.limit
    });
};

export async function findByID(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    
    const id = event.pathParameters && event.pathParameters.id ? event.pathParameters.id : undefined;

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

    const medicine = await MedicineController.findById(id);

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
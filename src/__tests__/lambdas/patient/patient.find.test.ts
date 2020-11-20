'use strict';

import { StatusCodes } from 'http-status-codes';
import querystring from 'querystring';
import { find } from '../../../patient';


let event, context;

describe('Patient find', function () {
    
    const data = {
        "owner": "5fafc06f0d71f6000fd71a04",
        "patient": "5fafc06f0d71f6000fd71a04",
    };

    const qs = querystring.stringify(data);

    beforeEach(async () => {
        event = {
            queryStringParameters: data
        };
    });

    it('should succeed in getting records', async () => {
        event = {};
        
        const result = await find(event);
        expect(result.statusCode).toEqual(StatusCodes.OK);
    });

    it('should succeed in getting queried records', async () => {
        const result = await find(event);
        expect(result.statusCode).toEqual(StatusCodes.OK);
    });
    
});

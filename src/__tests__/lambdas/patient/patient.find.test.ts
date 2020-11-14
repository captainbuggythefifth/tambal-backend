'use strict';

import { StatusCodes } from 'http-status-codes';
import querystring from 'querystring';
import { find } from '../../../patient';


let event, context;

describe('Patient find', function () {
    
    const data = {
        "owner": "5f914cbebf8d7d00082ad7b6",
        "patient": "5f914cbebf8d7d00082ad7b6",
    };

    const qs = querystring.stringify(data);

    beforeEach(() => {
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

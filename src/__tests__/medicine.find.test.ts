'use strict';

import { StatusCodes } from 'http-status-codes';
import querystring from 'querystring';
import { find } from './../medicine';

let event, context;

describe('Medicine find', function () {
    
    const data = {
        "brandName": "Brand Name",
        "owner": "alalalaj",
        "genericName": "Generic Name",
    };

    const qs = querystring.stringify(data);

    beforeEach(() => {
        event = {
            queryStringParameters: data
        };
    });

    it('should succeed', async () => {
        event = {};
        const result = await find(event);
        expect(result.statusCode).toEqual(StatusCodes.OK);
    });

    it('should succeed', async () => {
        const result = await find(event);
        expect(result.statusCode).toEqual(StatusCodes.OK);
    });
    
});

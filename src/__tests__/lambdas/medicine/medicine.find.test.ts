'use strict';

import { StatusCodes } from 'http-status-codes';
import querystring from 'querystring';
import { find } from './../../../medicine';

let event, context;

describe('Medicine find', function () {
    
    const data = {
        "brandName": "Brand Name",
        "owner": "5fafc06f0d71f6000fd71a04",
        "genericName": "Generic Name",
    };

    const qs = querystring.stringify(data);

    beforeEach(() => {
        event = {
            queryStringParameters: data
        };
    });

    it('should succeed in getting records', async () => {
        event = {};
        // should get all
        const result = await find(event);
        expect(result.statusCode).toEqual(StatusCodes.OK);
    });

    it('should succeed in getting queried records', async () => {
        const result = await find(event);
        console.log("result: ", result);
        
        expect(result.statusCode).toEqual(StatusCodes.OK);
    });
    
});

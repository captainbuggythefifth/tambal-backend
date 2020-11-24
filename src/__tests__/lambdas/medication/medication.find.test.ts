'use strict';

import { StatusCodes } from 'http-status-codes';
import querystring from 'querystring';
import { find } from '../../../medication';

let event, context;

describe('Medication find', function () {
    
    const data = {
        "owner": "Brand Name",
        "stocks": 10,
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

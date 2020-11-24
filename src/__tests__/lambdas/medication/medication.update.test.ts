'use strict';

import { StatusCodes } from 'http-status-codes';
import querystring from 'querystring';
import { update } from '../../../medication';

let event, context;

describe('Medication update', function () {

    const data = {
        "id": "5fa6a6376225089f95e512b0",
    };

    const maintenance = {
        "startsIn": new Date().toISOString(),
    };

    const qs = querystring.stringify(data);

    beforeEach(() => {
        event = {
            pathParameters: data,
            body: maintenance
        };
    });

    it('should fail when no pathpameters', async () => {
        const result = await update({
            ...event,
            pathParameters: {}
        });
        expect(result.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    });

    it('should fail when id is not valid', async () => {
        const result = await update({
            ...event,
            pathParameters: {
                id: "1"
            }
        });
        expect(result.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    });

    it('should fail when body is not valid', async () => {
        const result = await update({
            ...event,
            body: undefined
        });
        expect(result.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    });

    it('should succeed', async () => {
        const result = await update(event);
        
        expect(result.statusCode).toEqual(StatusCodes.OK);
    });

});

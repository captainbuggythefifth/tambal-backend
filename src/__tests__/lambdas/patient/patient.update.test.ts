'use strict';

import { StatusCodes } from 'http-status-codes';
import querystring from 'querystring';
import { update } from '../../../patient';

let event, context;

describe('Patient update', function () {

    const data = {
        "id": "5fb616d59146c00f5e433d9e",
    };

    const patient = {
        "organizers": [
            "5f914cbebf8d7d00082ad7b6",
            "5f914cbebf8d7d00082ad7b7"
        ]
    };

    const qs = querystring.stringify(data);

    beforeEach(() => {
        event = {
            pathParameters: data,
            body: patient
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

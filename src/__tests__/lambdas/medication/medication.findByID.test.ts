'use strict';

import { StatusCodes } from 'http-status-codes';
import querystring from 'querystring';
import { findByID } from '../../../medication';

let event, context;

describe('Medication findByID', function () {

    const data = {
        "id": "5fa6a6376225089f95e512b0",
    };

    const qs = querystring.stringify(data);

    beforeEach(() => {
        event = {
            pathParameters: data
        };
    });

    it('should fail when no pathpameters', async () => {
        const result = await findByID({
            ...event,
            pathParameters: {}
        });
        expect(result.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    });

    it('should fail when id is not valid', async () => {
        const result = await findByID({
            ...event,
            pathParameters: {
                id: "1"
            }
        });
        expect(result.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    });

    it('should fail when id is not found', async () => {
        
        const result = await findByID({
            ...event,
            pathParameters: {
                id: "5fa685b5a301888f24a821f2"
            }
        });
        expect(result.statusCode).toEqual(StatusCodes.NOT_FOUND);
    });

    it('should succeed', async () => {
        console.log("event: ", event);
        
        const result = await findByID(event);
        expect(result.statusCode).toEqual(StatusCodes.OK);
    });

});

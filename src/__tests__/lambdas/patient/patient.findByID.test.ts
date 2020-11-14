'use strict';

import { StatusCodes } from 'http-status-codes';
import querystring from 'querystring';
import { findByID } from '../../../patient';

let event, context;

describe('Patient findByID', function () {

    const data = {
        "id": "5fae8f6640823d8cd6791cbf",
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
        
        const result = await findByID(event);
        expect(result.statusCode).toEqual(StatusCodes.OK);
    });

});

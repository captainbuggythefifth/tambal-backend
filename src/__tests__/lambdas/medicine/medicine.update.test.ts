'use strict';

import { StatusCodes } from 'http-status-codes';
import querystring from 'querystring';
import { update } from './../../../medicine';

let event, context;

describe('Medicine update', function () {

    const data = {
        "id": "5fa685b5a301888f24a821fb",
    };

    const medicine = {
        "brandName": "Brand Names",
        "owner": "alalalaj",
        "genericName": "Generic Names",
        "metrology": {
            "weight": 20,
            "measurement": "mg"
        }
    };

    const qs = querystring.stringify(data);

    beforeEach(() => {
        event = {
            pathParameters: data,
            body: medicine
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

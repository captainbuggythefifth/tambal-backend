'use strict';

import { StatusCodes } from 'http-status-codes';
import { create, find } from '../medicine';

let event, context;

describe('Medicine create', function () {
    
    const failResponse = {"body": "Must have body", "statusCode": 400};

    const data = {
        "brandName": "Brand Name",
        "owner": "alalalaj",
        "genericName": "Generic Name",
        "metrology": {
            "weight": 20,
            "measurement": "mg"
        }
    };

    beforeEach(() => {
        event = {
            body: data
        };
    })

    it('should fail when there is body in event', async () => {
        event = {};
        const result = await create(event);
        expect(result.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        expect(result).toEqual(failResponse)

    });

    it('should fail when there is missing required from body', async () => {
        
        const result = await create({
            ...event.body,
            brandName: ''
        });
        expect(result.statusCode).toEqual(StatusCodes.BAD_REQUEST);

    });

    it('should succeed', async () => {
        const result = await create(event);
        expect(result.statusCode).toEqual(StatusCodes.OK);
    });
    
});

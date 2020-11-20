'use strict';

import { StatusCodes } from 'http-status-codes';
import { create } from './../../../medicine';

let event, context;

describe('Medicine create', function () {
    
    const data = {
        "brandName": "Brand Name",
        "owner": "5fafc06f0d71f6000fd71a04",
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
        expect(result.statusCode).toEqual(StatusCodes.CREATED);
    });
    
});

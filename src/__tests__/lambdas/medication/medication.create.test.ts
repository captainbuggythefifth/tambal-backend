'use strict';

import { StatusCodes } from 'http-status-codes';
import { create } from '../../../medication';

let event, context;

describe('Medication create', function () {
    
    const data = {
        "owner": "5f914cbebf8d7d00082ad7b6",
        "medicines": [
            "5fa79e19cb1400d0b0495a3e"
        ],
        "stocks": 12,
        "schedule": {
            frequency: 8,
            every: "H"
        },
        "startsIn": new Date().toISOString(),
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

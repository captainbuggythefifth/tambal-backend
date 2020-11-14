'use strict';

import { StatusCodes } from 'http-status-codes';
import { create } from './../../../patient';

let event, context;

describe('Patient create', function () {
    
    const data = {
        "owner": "5f914cbebf8d7d00082ad7b6",
        "maintenances": [
            "5fa79e837e1514d0ff1fe4a3"
        ],
        "organizers": [
            "5f914cbebf8d7d00082ad7b6"
        ],
        "patient": "5f914cbebf8d7d00082ad7b6",
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
            owner: ''
        });
        expect(result.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    });

    it('should succeed', async () => {
        const result = await create(event);
        expect(result.statusCode).toEqual(StatusCodes.CREATED);
    });
    
});

'use strict';

import { StatusCodes } from 'http-status-codes';
import { create } from './../../../patient';

let event, context;

describe('Patient create', function () {
    
    const data = {
        "owner": "5fafc06f0d71f6000fd71a04",
        "maintenances": [
            "5fa79e837e1514d0ff1fe4a3"
        ],
        "organizers": [
            "5fafc06f0d71f6000fd71a04"
        ],
        "patient": "5fafc06f0d71f6000fd71a04",
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

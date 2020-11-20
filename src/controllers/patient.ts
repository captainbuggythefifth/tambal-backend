import { assignQuery } from '../utils/assign-query';
// import PatientModel, { Maintenance, PatientDocument } from './../models/maintenance';
import PatientModel, { Patient, PatientDocument } from '../models/patient';
import { FindOptions } from '../interfaces/find-options';

interface PatientFindOptions extends FindOptions {
    owner?: string,
    // organizers?: string[]
    patient?: string,
}

async function create(maintenance: Patient): Promise<PatientDocument> {
    return await PatientModel
        .create(maintenance)
        .then((data: PatientDocument) => {
            return data;
        })
        .catch((error: Error) => {
            throw error;
        });
}

async function find(options: PatientFindOptions): Promise<PatientDocument[]> {

    const structure = [
        'owner',
        'patient',
    ];

    const query = assignQuery(structure, options)
    
    return await PatientModel
        .find(query)
        .skip(options.page * options.limit)
        .limit(options.limit)
        .sort({
            [options.orderBy]: options.sortBy
        })
        .populate('maintainances')
        .populate('organizers')
        .populate('patient')
        .populate('owner')
        .exec()
        .then((data: PatientDocument[]) => {
            return data;
        })
        .catch((error: Error) => {
            throw error;
        });
}

async function findById(id: string): Promise<PatientDocument | null> {

    return await PatientModel
        .findById(id)
        .then((data: PatientDocument | null) => {
            return data;
        })
        .catch((error: Error) => {
            throw error;
        });
}

async function update(_id: string, patient: Patient): Promise<PatientDocument | null> {

    const structure = [
        'owner',
        'organizers',
        'patient',
        'maintenances',
    ];

    let query = assignQuery(structure, patient)

    return await PatientModel
        .updateOne({ _id: _id }, { $set: query })
        .then((data: PatientDocument | null) => {
            return data;
        })
        .catch((error: Error) => {
            throw error;
        });
}


export default {
    create,
    find,
    findById,
    update
};
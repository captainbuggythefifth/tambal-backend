import { assignQuery } from './../utils/assign-query';
import MedicationModel, { Medication, MedicationDocument } from './../models/medication';
import { FindOptions } from './../interfaces/find-options';

interface MedicationFindOptions extends FindOptions {
  owner?: string,
  stocks?: number,
}

async function create(Medication: Medication): Promise<MedicationDocument> {
  return await MedicationModel
    .create(Medication)
    .then((data: MedicationDocument) => {
      return data;
    })
    .catch((error: Error) => {
      throw error;
    });
}

async function find(options: MedicationFindOptions): Promise<MedicationDocument[]> {

  const structure = [
    'owner',
    'stocks',
    'schedule',
    'startsIn',
    'endsIn'
  ];

  let query = assignQuery(structure, options)

  return await MedicationModel
    .find(query)
    .skip(options.page * options.limit)
    .limit(options.limit)
    .sort({
      [options.orderBy]: options.sortBy
    })
    .populate('medicines')
    .exec()
    .then((data: MedicationDocument[]) => {
      return data;
    })
    .catch((error: Error) => {
      throw error;
    });
}

async function findById(id: string): Promise<MedicationDocument | null> {

  return await MedicationModel
    .findById(id)
    .then((data: MedicationDocument | null) => {
      return data;
    })
    .catch((error: Error) => {
      throw error;
    });
}

async function update(_id: string, medication: Medication): Promise<MedicationDocument | null> {

  const structure = [
    'owner',
    'medicines',
    'stocks',
    'schedule',
    'startsIn',
    'endsIn'
  ];

  let query = assignQuery(structure, medication)

  return await MedicationModel
    .updateOne({ _id: _id }, { $set: query })
    .then((data: MedicationDocument | null) => {
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
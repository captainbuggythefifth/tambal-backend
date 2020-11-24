import MedicineModel, { Medicine, MedicineDocument } from './../models/medicine';
import { assignQuery } from './../utils/assign-query';

interface FindOptions {
  page: number,
  limit: number
}

interface MedicineFindOptions extends FindOptions {
  owner?: string,
  genericName?: string,
  brandName?: string,
}

async function create(medicine: Medicine): Promise<MedicineDocument> {
  return await MedicineModel.create(medicine)
    .then((data: MedicineDocument) => {
      return data;
    })
    .catch((error: Error) => {
      throw error;
    });
}

async function find(options: MedicineFindOptions): Promise<MedicineDocument[]> {

  const structure = [
    'owner',
    'genericName',
    'brandName'
  ];

  let query = assignQuery(structure, options)

  return await MedicineModel
    .find(query)
    .skip(options.page * options.limit)
    .limit(options.limit)
    .exec()
    .then((data: MedicineDocument[]) => {
      return data;
    })
    .catch((error: Error) => {
      throw error;
    });
}

async function findById(id: string): Promise<MedicineDocument | null> {

  return await MedicineModel
    .findById(id)
    .then((data: MedicineDocument | null) => {
      return data;
    })
    .catch((error: Error) => {
      throw error;
    });
}

async function update(_id: string, medicine: Medicine): Promise<MedicineDocument | null> {

  const structure = [
    'owner',
    'genericName',
    'brandName',
    'metrology'
  ];

  let query = assignQuery(structure, medicine)

  // const result = await MedicineModel.updateOne({ _id: _id }, { $set: query });

  return await MedicineModel
    .updateOne({ _id: _id }, { $set: query })
    .then((data: MedicineDocument | null) => {
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
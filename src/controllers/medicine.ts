import MedicineModel, { Medicine, MedicineDocument } from '../models/medicine';

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
  let query = {
    owner: options.owner ? options.owner : undefined,
    genericName: options.genericName ? options.genericName : undefined,
    brandName: options.brandName ? options.brandName : undefined,
  };

  if (!query.brandName) {
    delete query.brandName
  }

  if (!query.owner) {
    delete query.owner
  }

  if (!query.genericName) {
    delete query.genericName
  }

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

  let query = {
    owner: medicine.owner ? medicine.owner : undefined,
    genericName: medicine.genericName ? medicine.genericName : undefined,
    brandName: medicine.brandName ? medicine.brandName : undefined,
    metrology: medicine.metrology ? medicine.metrology : undefined
  };

  if (!query.brandName) {
    delete query.brandName
  }

  if (!query.owner) {
    delete query.owner
  }

  if (!query.genericName) {
    delete query.genericName
  }

  if (!query.metrology) {
    delete query.metrology
  }

  const result = await MedicineModel.updateOne({ _id: _id }, { $set: query });
  console.log("result: ", result);
  
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
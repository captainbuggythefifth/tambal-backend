import { assignQuery } from './../utils/assign-query';
import MaintenanceModel, { Maintenance, MaintenanceDocument } from './../models/maintenance';
import { FindOptions } from './../interfaces/find-options';

interface MaintenanceFindOptions extends FindOptions {
  owner?: string,
  stocks?: number,
}

async function create(maintenance: Maintenance): Promise<MaintenanceDocument> {
  return await MaintenanceModel
    .create(maintenance)
    .then((data: MaintenanceDocument) => {
      return data;
    })
    .catch((error: Error) => {
      throw error;
    });
}

async function find(options: MaintenanceFindOptions): Promise<MaintenanceDocument[]> {

  const structure = [
    'owner',
    'stocks',
    'schedule',
    'startsIn',
    'endsIn'
  ];

  let query = assignQuery(structure, options)

  return await MaintenanceModel
    .find(query)
    .skip(options.page * options.limit)
    .limit(options.limit)
    .sort({
      [options.orderBy]: options.sortBy
    })
    .populate('medicines')
    .exec()
    .then((data: MaintenanceDocument[]) => {
      return data;
    })
    .catch((error: Error) => {
      throw error;
    });
}

async function findById(id: string): Promise<MaintenanceDocument | null> {

  return await MaintenanceModel
    .findById(id)
    .then((data: MaintenanceDocument | null) => {
      return data;
    })
    .catch((error: Error) => {
      throw error;
    });
}

async function update(_id: string, maintenance: Maintenance): Promise<MaintenanceDocument | null> {

  const structure = [
    'owner',
    'medicines',
    'stocks',
    'schedule',
    'startsIn',
    'endsIn'
  ];

  let query = assignQuery(structure, maintenance)

  return await MaintenanceModel
    .updateOne({ _id: _id }, { $set: query })
    .then((data: MaintenanceDocument | null) => {
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
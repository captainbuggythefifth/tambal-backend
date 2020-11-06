import mongoose from 'mongoose';

const validateMongooseID = (id: string): boolean => {
    return mongoose.Types.ObjectId.isValid(id);
}

export {
    validateMongooseID
}

import mongoose, { Schema, Document } from 'mongoose';
import { Status } from './common';
import './user';
import { UserDocument } from './user';

export enum Measurement {
    ml = 'ml',
    L = 'L',
    mg = 'mg',
    G = 'G'
}

export interface Medicine extends MedicineDocument {
    owner: UserDocument['_id'],
    genericName: string,
    brandName: string,
    metrology: Metrology,
    status: Status
}

export interface Metrology extends MetrologyDocument {
    weight: number,
    measurement: Measurement
}

export interface MetrologyDocument extends Document {

}

export interface MedicineDocument extends Document {

}

const MedicineSchema: Schema = new Schema({
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    genericName: { type: String, required: true },
    brandName: { type: String, required: true },
    metrology: {
        weight: { type: Number, required: true },
        measurement: { type: String, required: true, enum: Object.values(Measurement) },
    },
    status: {
        type: String,
        enum: Object.values(Status),
        default: "ACTIVE"
    }
}, {
    timestamps: true
});

// Export the model and return your IUser interface
export default mongoose.model<MedicineDocument>('Medicine', MedicineSchema);

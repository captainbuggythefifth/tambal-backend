import mongoose, { Schema, Document } from 'mongoose';

export enum Measurement {
    ml = 'ml',
    L = 'L',
    mg = 'mg',
    G = 'G'
}

export interface Medicine extends MedicineDocument{
    owner: string,
    genericName: string,
    brandName: string,
    metrology: Metrology
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
    owner: { type: String, required: true },
    genericName: { type: String, required: true },
    brandName: { type: String, required: true },
    metrology: {
        weight: { type: String, required: true },
        measurement: { type: String, required: true, enum: Object.values(Measurement) },
    }
});

// Export the model and return your IUser interface
export default mongoose.model<MedicineDocument>('Medicine', MedicineSchema);

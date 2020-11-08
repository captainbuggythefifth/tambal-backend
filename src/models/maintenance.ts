import mongoose, { Schema, Document, Types } from 'mongoose';
import './medicine';
import { MedicineDocument } from './medicine'


export interface Schedule {
    frequency: number,
    every: 'm' | 'H' | 'D' | 'W' | 'M' | 'Y'
}

export interface Maintenance extends MaintenanceDocument {
    owner: string,
    stocks: number,
    medicines: [MedicineDocument['_id']],
    schedule: Schedule,
    startsIn: string,
    endsIn: string
}

export interface MaintenanceDocument extends Document {

}

const MaintenanceSchema: Schema = new Schema<Maintenance>({
    owner: { type: String, required: true },
    stocks: {
        type: Number
    },
    medicines: [{
        type: Schema.Types.ObjectId,
        ref: "Medicine",
    }],
    schedule: {
        type: Map,
        of: String
    },
    startsIn: {
        type: String
    },
    endsIn: {
        type: String
    }
}, {
    timestamps: true
});

// Export the model and return your IUser interface
export default mongoose.model<MaintenanceDocument>('Maintenance', MaintenanceSchema);

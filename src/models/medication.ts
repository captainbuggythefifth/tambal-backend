import mongoose, { Schema, Document, Types } from 'mongoose';
import { Status } from './common';
import './medicine';
import './user';
import { MedicineDocument } from './medicine'
import { UserDocument } from './user';


export interface Schedule {
    frequency: number,
    every: 'm' | 'H' | 'D' | 'W' | 'M' | 'Y'
}

export interface Medication extends MedicationDocument {
    owner: UserDocument['_id'],
    stocks: number,
    medicines: MedicineDocument['_id'][],
    schedule: Schedule,
    startsIn: string,
    endsIn: string,
    status: Status
}

export interface MedicationDocument extends Document {

}

const MedicationSchema: Schema = new Schema<Medication>({
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
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
export default mongoose.model<MedicationDocument>('Medication', MedicationSchema);

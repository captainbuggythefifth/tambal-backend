import mongoose, { Schema, Document, Types } from 'mongoose';
import { Status } from './common';
import './maintenance';
import './medication';
import './user';
import { MaintenanceDocument } from './maintenance';
import { MedicationDocument } from './medication';
import { UserDocument } from './user'

export interface Patient extends PatientDocument {
    owner: UserDocument['_id'],
    organizers: UserDocument['_id'][]
    patient: UserDocument['_id'],
    maintenances: MaintenanceDocument['_id'][],
    medications: MedicationDocument['_id'][],
    status: Status
}

export interface PatientDocument extends Document {

}

const PatientSchema: Schema = new Schema<Patient>({
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    organizers: [{
        type: Schema.Types.ObjectId,
        ref: "User",
    }],
    patient: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    maintenances: [{
        type: Schema.Types.ObjectId,
        ref: "Maintenance",
    }],
    medications: [{
        type: Schema.Types.ObjectId,
        ref: "Medication",
    }],
    status: {
        type: String,
        enum: Object.values(Status),
        default: "ACTIVE"
    }
}, {
    timestamps: true
});

// Export the model and return your IUser interface
export default mongoose.model<PatientDocument>('Patient', PatientSchema);

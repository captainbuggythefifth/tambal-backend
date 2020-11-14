import mongoose, { Schema, Document, Types } from 'mongoose';
import './maintenance';
import { MaintenanceDocument } from './maintenance'


export interface Patient extends PatientDocument {
    owner: string,
    organizers: string[]
    patient: string,
    maintenances: MaintenanceDocument['_id'][]
}

export interface PatientDocument extends Document {

}

const PatientSchema: Schema = new Schema<Patient>({
    owner: { type: String, required: true },
    organizers: [{
        type: String, required: true
    }],
    patient: {
        type: String, required: true
    },
    maintenances: [{
        type: Schema.Types.ObjectId,
        ref: "Maintenance",
    }],
}, {
    timestamps: true
});

// Export the model and return your IUser interface
export default mongoose.model<PatientDocument>('Patient', PatientSchema);

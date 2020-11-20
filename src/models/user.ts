import mongoose, { Schema, Document } from 'mongoose';
import s3Get from '../utils/s3/get';
import { Status } from './common';

export enum Gender {
    male = 'male',
    female = 'female',
    undisclosed = 'undisclosed'
}

export interface Address extends Document {
    street: string;
    city: string;
    postCode: string;
}

export interface User extends UserDocument { }

export interface UserDocument extends Document {
    fullName: string,
    firstName: string,
    lastName: string,
    email: string,
    address?: Address,
    gender?: Gender,
    phone?: string,
    birthDate?: string,
    hash?: string,
    salt?: string,
    accessToken?: string,
    refreshToken?: string,
    deviceTokens?: string[],
    agreedConditions?: string[],
    picture?: string,
    status?: Status,
    pictureUrl?: any,
    pictureUrlData?: any
}

const UserSchema: Schema = new Schema({
    fullName: {
        type: String,
        trim: true,
        required: true
    },
    firstName: {
        type: String,
        trim: true,
        required: true
    },
    lastName: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        trim: true,
        required: true,
        index: {
            unique: true
        },
        minLength: [
            6,
            "Email cannot be shorter than 6 characters"
        ],
        maxLength: [
            64,
            "Email cannot be longer than 64 characters"
        ]
    },
    gender: { type: String, enum: Object.values(Gender) },
    address: {
        street: { type: String },
        city: { type: String },
        postCode: { type: String }
    },
    phone: {
        type: String,
        trim: true,
        index: {
            unique: true
        },
        // required: true
    },
    birthDate: {
        type: String,
        trim: true,
        required: true
    },
    hash: {
        type: String,
        select: false
    },
    salt: {
        type: String,
        select: false
    },
    accessToken: {
        type: String,
    },
    refreshToken: {
        type: String
    },
    deviceTokens: {
        type: [String]
    },
    agreedConditions: {
        type: [String]
    },
    picture: {
        type: String,
        get: (picture: string) => {
            
            const pictureData = s3Get({
                keyImage: picture
            });

            if (pictureData.success) {
                return pictureData.data
            }

            return picture
            
        }
    },
    status: {
        type: String,
        enum: Object.values(Status),
        default: "ACTIVE"
    },

},
    {
        timestamps: true,
        toObject: { getters: true },
        toJSON: { getters: true },
    },
);

export default mongoose.model<User>('User', UserSchema);
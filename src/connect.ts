import mongoose from 'mongoose';
import { ksmManager } from './utils/ksm-manager';

const connect = () => {

    const connect = async () => {

        if (!process.env.SM_MONGO) {
            return false
        }

        const result = await ksmManager(process.env.SM_MONGO);

        if (!result.secret) {
            return false
        }

        const { DB_AUTH_USER, DB_AUTH_PASS, DB_NAME, DB_URL } = result.secret

        const DB = `mongodb+srv://${DB_AUTH_USER}:${DB_AUTH_PASS}@${DB_URL}/${DB_NAME}?retryWrites=true&w=majority`


        mongoose.connect(DB, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
            .then(() => {
                return console.info(`Successfully connected to db`);
            })
            .catch(error => {
                console.error('Error connecting to database: ', error);
                return process.exit(1);
            });
    };
    connect();

    mongoose.connection.on('disconnected', connect);
};

export {
    connect
}
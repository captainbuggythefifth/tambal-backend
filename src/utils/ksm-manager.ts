import AWS from 'aws-sdk';

// Create a Secrets Manager client
const client = new AWS.SecretsManager();

interface SECRET {
    DB_AUTH_USER: string,
    DB_AUTH_PASS: string,
    DB_NAME: string,
    DB_URL: string
}

interface KSManagerResult {
    success: boolean,
    secret: SECRET | null
}

const ksmManager = async (secretName: string): Promise<KSManagerResult> => {

    let result: KSManagerResult = {
        success: false,
        secret: null
    }

    const data = await client.getSecretValue({ SecretId: secretName }).promise();

    if (!data || !data.SecretString) {
        return result
    }

    result = {
        ...result,
        success: true,
        secret: JSON.parse(data.SecretString)
    };

    return result
}

export { ksmManager }
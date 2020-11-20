import AWS from 'aws-sdk'

const s3 = new AWS.S3();
    
const s3GetPromise = async ({
    keyImage,
}) => {
    let result = {
        success: false,
        data: "",
        error: null
    }
    try {

        if (!process.env.S3_BUCKET_IMAGES) {
            return result
        }

        const params = { 
            Bucket: process.env.S3_BUCKET_IMAGES.toLowerCase(), 
            Key: keyImage,
            Expires: 60 * 5,
        }

        const s3GetSignedUrlResult = await s3.getSignedUrlPromise('getObject', params);

        result = {
            ...result,
            data: s3GetSignedUrlResult,
            success: true
        };
    } catch (error) {
        result = {
            ...result,
            error
        }
        console.log("get signed url error: ", error);
    }

    return result
}

export default s3GetPromise
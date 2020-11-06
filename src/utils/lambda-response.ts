interface Body {
    message?: string
    data?: any,
    page?: number,
    limit?: number,
}
interface LambdaResponseParams extends Body {
    statusCode: number,
}

const parseToBody = (body: Body): string => {
    return JSON.stringify(body)
}

const lambdaResponse = (params: LambdaResponseParams) => {
    return {
        'statusCode': params.statusCode,
        'body': parseToBody(params)
    }
}

export {
    lambdaResponse
}
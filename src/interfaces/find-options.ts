export interface FindOptions {
    page: number,
    limit: number,
    orderBy: string,
    sortBy: string
}

export const findOptionsDefaultParameters: FindOptions  = {
    page: 0,
    limit: 10,
    orderBy: 'createdAt',
    sortBy: 'asc'
};
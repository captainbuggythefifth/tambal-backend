const assignQuery = (structure: Array<string>, obj: object) => {

    let query = {};

    structure.map((struct: string) => {
        const structHasValue = obj[struct] ? true : false;
        if (structHasValue) {
            query[struct] = obj[struct]
        }
    });

    return query
}

export {
    assignQuery
}
const validateParameters = (topic: object, parameters: string[]) => {

    let valid = true

    parameters.map((parameter) => {
        const inValidParam = topic[parameter] === undefined || topic[parameter] === null || topic[parameter] === '' || topic[parameter] === 0;

        if (inValidParam) {
            valid = false
            return false
        }
    });

    return valid;
};

export { validateParameters }
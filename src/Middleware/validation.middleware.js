export const validationMiddleware = (schema) => {
    return async (req, res, next) => {
        const schemaKeys = Object.keys(schema) //['body' , 'params']
        let validationErrors = [];

        for (const key of schemaKeys) {
            const { error } = schema[key].validate(req[key], { abortEarly: false })
            if (error) {
                validationErrors.push(...error.details);
            }
        }
        if (validationErrors.length) return res.status(400).json({ message: 'Validation errors', errors: validationErrors });
        next();
    }
}
import Joi from "joi"


export const signUpSchema = {
    body: Joi.object({
        name: Joi.string().alphanum().messages({
            "string.alphanum": "user name must be alpha and numbers only",
            "string.base": "user name must be string",
            "any.required": "user name required"
        }),
        email: Joi.string().email({
            tlds: {
                allow: ['com', 'net', "org"],
                // deny:['yaho']
            },
            // minDomainSegments:2,
            maxDomainSegments: 3,
            multiple: true,
            // separator:'#'
        }),
        password: Joi.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*])[A-Za-z\d@$!%*]{8,}$/).messages({
            "string.pattern.base": "password must be at least 8 char long and contain one uppercase letter , one spical char ",
        }),
        confirmPassword: Joi.string().valid(Joi.ref('password')),
        phone: Joi.string(),
        age: Joi.number(),

        min: Joi.number(),
        max: Joi.when('min', {
            is: Joi.number().integer().greater(10),
            then: Joi.number().greater(Joi.ref('min')),
            otherwise: Joi.number().integer().less(10)
        })
    }).options({ presence: "required" })
    // .with('email', 'password')
}


const validator = require('validator')

/*
 Schema an object with each attribute inside has to be the request body's field and point to an object containing attributes type, required, code, message.
 type: int, text, email, phone, password, btc_address (just for fun lmao)
 max_length: valid and is checked only for text and integer. pass -1 if there's no max length
 code: error code you want sent back if the data is invalid
 message: the message you want sent in the error body

 Example:
 {
        "email": {
            "type": "email",
            "max_length": -1,
            "required": true,
            "code": 401,
            "message": "The email entered is not a valid email address"
        }, ...
    }
 */

export function validateBody(schema) {
    return function (req, res, next) {
        for (const key in schema) {
            const data = req.body[key]
            const fieldSchema = schema[key]

            let error = false

            if (req.body[key] == null && fieldSchema.required) {
                error = true
                sendErrorMessage(res, fieldSchema)
                break
            }

            switch (fieldSchema.type) {
                case 'int':
                    error = (!Number.isInteger(data))

                    if (fieldSchema.max_length !== -1)
                        error = data.length !== fieldSchema.max_length

                    break

                case 'text':
                    error = (!isString(data))

                    if (fieldSchema.max_length !== -1)
                        error = data.length !== fieldSchema.max_length

                    break

                case 'email':
                    if (isString(data)) {
                        error = !validator.isEmail(data)
                    } else {
                        error = true
                    }
                    break

                case 'phone':
                    if (isString(data)) {
                        error = !validator.isMobilePhone(data, ['en-IN'])
                    } else {
                        error = true
                    }
                    break

                // A password must be at least 8 characters and have at least one lowercase letter, one uppercase letter, one number, and one symbol
                case 'password':
                    if (isString(data)) {
                        error = !validator.isStrongPassword(data)
                    } else {
                        error = true
                    }
                    break

                case 'btc_address':
                    if (isString(data)) {
                        error = !validator.isBtcAddress(data)
                    } else {
                        error = true
                    }
                    break

                default:
                    res.code(500).send({
                        name: "Internal server error",
                        message: "A server error occurred while verifying the validity of the data sent"
                    })
            }

            if (error) {
                sendErrorMessage(res, fieldSchema)
                break
            }
        }
        next()
    }
}

function isString(data) {
    return (typeof data === 'string' || data instanceof String)
}

const defaultErrorBodyName = 'Invalid data'

function sendErrorMessage(res, fieldSchema) {
    res.send(fieldSchema.code).body({
        name: defaultErrorBodyName,
        message: fieldSchema.message
    })
}

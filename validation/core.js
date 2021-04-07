const validator = require("validator");

/*
Allowed rules

required: boolean
type: [int, text, email, phone, password, btc_address, float, string]
min: checks against length if string, and value if number
max: checks against length if string, and value if number
custom: array of functions that take 1 argument - the value and returns a boolean
*/

const defaultErrorCode = 402;

const typeCheckRules = {
    'int': Number.isInteger,
    'float': validator.default.isFloat,
    'string': (data) => typeof data === 'string' || data instanceof String,
    'email': (data) => validator.default.isEmail(data + ''),
    'phone': (data) => validator.default.isMobilePhone(data + '', ['en-In']),
    'btc': (data) => validator.default.isBtcAddress(data + '') 
}

function validateCore(object, rules, code) {
    for(const key in Object.keys(rules)) {
        const data = object[key];
        const rule = rules[key];

        if(!data && rule.required) {
            return {
                valid: false,
                errorRule: "required",
                errorCode: code ? code : defaultErrorCode,
                errorMessage: `The required field ${key} was not present`,
                key: key,
                value: "null"
            }
        }

        if(!Object.keys(typeCheckRules).includes(rule.type)) {
            return {
                valid: false,
                errorRule: "type",
                errorCode: code ? code : defaultErrorCode,
                errorMessage: `${rule.type} is not a recognized type`,
                key: key,
                value: data
            }
        }

        if(!typeCheckRules[rule.type](data)) {
            return {
                valid: false,
                errorRule: "type",
                errorCode: code ? code : defaultErrorCode,
                errorMessage: `${data} is not of type ${rule.type}`,
                key: key,
                value: data
            }
        }

        if(rule.custom.length > 0) {
            if(!rules.custom.reduce((current, func) => {
                current = current && func(data);
            }, true)) {
                return {
                    valid: false,
                    errorRule: "custom",
                    errorCode: code ? code : defaultErrorCode,
                    errorMessage: `${data} failed custom validation`,
                    key: key,
                    value: data
                }
            }
        }
    }

    return {
        valid: true
    };
}

module.exports = {
    validateCore
}
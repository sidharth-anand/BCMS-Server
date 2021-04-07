const validateCore = require("./core");

/**
 * 
 * Rules sholud have these props:
 * schema: an object following description in validation/core
 * code: global error code which will be used if not overriden in individual object
 * message: pattern matched target;
 *  available rules:    
 *      RULE: rule where the error happened
 *      CODE: global/overriden code
 *      MSG: generated error message
 *      KEY: field in schema
 *      DATA: value of field
 */

function validationMiddleware(rules, target) {
    return (req, res, next) => {
        const validation = validateCore.validateCore(req[target], rules.schema, rules.code);
        if(validation.valid) {
            next();
        } else {
            let msg = rules.message;

            msg = msg.replace("RULE", validation.errorRule);
            msg = msg.replace("CODE", validation.errorCode + '');
            msg = msg.replace("MSG", validation.errorMessage);
            msg = msg.replace("KEY", validation.key);
            msg = msg.replace("DATA", validation.value);

            res.status(validation.errorCode).send({msg: msg});
        }
    }
};

function validateBody(rules) {
    return validationMiddleware(rules, 'body');
};

function validateParams(rules) {
    return validationMiddleware(rules, 'params');
};

module.exports = {
    validateBody,
    validateParams
};

/**
 * Example Usage:
 * route.get("/qwes", validateBody({
 *      code:403,
 *      message: 'KEY:DATA, MSG',
 *      schema: {
 *          name: {
 *              type: 'string',
 *              required: true,
 *          },
            email: {
 *              type: 'email',
 *              required: true,
 *              custom: [d => d.includes('.hyderabad.bits-pilani.ac.in')]
 *          }
 *      }
 * }))
 */
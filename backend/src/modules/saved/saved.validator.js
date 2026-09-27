const Joi = require("joi");

const SavedDTO = Joi.object({
    event: Joi.string().required()
})
module.exports = SavedDTO
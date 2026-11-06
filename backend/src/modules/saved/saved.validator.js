const Joi = require("joi");

const SavedDTO = Joi.object({
  movie: Joi.string().required(),
});
module.exports = SavedDTO;

const Joi = require("joi");

const categoryCreateDTO = Joi.object({
    title: Joi.string().min(3).max(100).required(),
    parentId: Joi.string().allow(null, '').optional().default(null),
    status: Joi.string().regex(/^(active|inactive)$/).required()
}).unknown()
const categoryUpdateDTO = Joi.object({
    title: Joi.string().min(3).max(100).required(),
    parentId: Joi.string().allow(null, '').optional().default(null),
    status: Joi.string().regex(/^(active|inactive)$/).required()
}).unknown()

module.exports = {
    categoryCreateDTO,
    categoryUpdateDTO
}
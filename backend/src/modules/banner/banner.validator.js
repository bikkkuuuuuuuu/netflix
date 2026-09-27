const Joi = require("joi");

const bannerCreateDTO = Joi.object({
    title: Joi.string().min(3).max(100).required(),
    link: Joi.string().uri().optional().empty(null, ''),
    status: Joi.string().regex(/^(active|inactive)$/).required(),
    startDate: Joi.date().required(),
    endDate: Joi.date().min(Joi.ref('startDate')).required()
})
const bannerUpdateDTO = Joi.object({
    title: Joi.string().min(3).max(100).required(),
    link: Joi.string().uri().optional().empty(null, ''),
    status: Joi.string().regex(/^(active|inactive)$/).required(),
    startDate: Joi.date().required(),
    endDate: Joi.date().min(Joi.ref('startDate')).required()
}).unknown()

module.exports = {
    bannerCreateDTO,
    bannerUpdateDTO
}
const { checkLogin } = require('../../middlewares/auth.middleware')
const { bodyValidator } = require('../../middlewares/bodyvalidator.middleware')
const uploader = require('../../middlewares/multipart-parser.middleware')
const { allowRole } = require('../../middlewares/rbac.middleware')
const categoryCtrl = require('./category.controller')
const { categoryCreateDTO, categoryUpdateDTO } = require('./category.validator')

const categoryRouter = require('express').Router()

categoryRouter.get('/home-category', categoryCtrl.getForHome)
categoryRouter.get('/search', categoryCtrl.searchCategory)

categoryRouter.get('/:slug/by-slug', categoryCtrl.getDetailBySlug)

categoryRouter.route('/')
    .post(checkLogin, allowRole('admin'), uploader().single('image'), bodyValidator(categoryCreateDTO), categoryCtrl.store)
    .get(checkLogin, allowRole('admin'), categoryCtrl.index)

categoryRouter.route('/:id')
    .get(checkLogin, allowRole('admin'), categoryCtrl.detail)
    .patch(checkLogin, allowRole('admin'), uploader().single('image'), bodyValidator(categoryUpdateDTO), categoryCtrl.update)
    .delete(checkLogin, allowRole('admin'), categoryCtrl.delete)

module.exports = categoryRouter
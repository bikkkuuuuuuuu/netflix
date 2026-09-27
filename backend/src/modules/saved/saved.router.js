const { checkLogin } = require('../../middlewares/auth.middleware')
const { bodyValidator } = require('../../middlewares/bodyvalidator.middleware')
const { allowRole } = require('../../middlewares/rbac.middleware')
const savedCtrl = require('./saved.controller')
const SavedDTO = require('./saved.validator')

const savedRouter = require('express').Router()

savedRouter.route('/')
    .post(checkLogin, allowRole(['admin', 'user']), bodyValidator(SavedDTO), savedCtrl.save)
    .get(checkLogin, allowRole(['admin', 'user']), savedCtrl.mySaved)

savedRouter.route('/:id')
    .delete(checkLogin, allowRole(['admin', 'user']), savedCtrl.delete)




module.exports = savedRouter
const categorySvc = require("./category.service");

class CategoryController {

    store = async (req, res, next) => {
        try {
            const data = await categorySvc.transformCreateRequest(req)
            const category = await categorySvc.createCategory(data)
            res.json({
                detail: category,
                message: "Category created successfully",
                status: "CATEGORY_CREATE_SUCCESS",
                options: null
            })

        } catch (exception) {
            console.log("store controller exception : ", exception)
            next(exception);
        }
    }

    searchCategory = async (req, res, next) => {
        try {
            let page = +req.query.page || 1;
            let limit = +req.query.limit || 10;
            let skip = (page - 1) * limit;


            let filter = {
                $and: [{
                    status: 'active'
                }]
            }
            if (req.query.search) {
                filter.$or = [{ title: new RegExp(req.query.search, 'i') }]

            }
            let data = await categorySvc.listAllCategory({ skip, limit, filter })

            res.json({
                detail: data,
                message: "Category list successfully",
                status: "CATEGORY_LIST_SUCCESS",
                options: null
            })

        } catch (exception) {
            console.log("index controller exception : ", exception)
            next(exception);
        }
    }

    index = async (req, res, next) => {
        try {
            let page = +req.query.page || 1;
            let limit = +req.query.limit || 20;
            let skip = (page - 1) * limit;


            let filter = {}
            if (req.query.search) {
                filter = {
                    $or: [{ title: new RegExp(req.query.search, 'i') },
                    { status: new RegExp(req.query.search, 'i') }]
                }
            }
            let data = await categorySvc.listAllCategory({ skip, limit, filter })
            const totalCount = await categorySvc.countData(filter)

            res.json({
                detail: data,
                message: "Category list successfully",
                status: "CATEGORY_LIST_SUCCESS",
                options: {
                    currentPage: page,
                    limit: limit,
                    totalData: totalCount
                }
            })

        } catch (exception) {
            console.log("index controller exception : ", exception)
            next(exception);
        }
    }
    detail = async (req, res, next) => {
        try {
            const id = req.params.id
            const data = await categorySvc.getSingleByFilter({
                _id: id
            })
            res.json({
                detail: data,
                message: "Category detail successfully",
                status: "CATEGORY_DETAIL_SUCCESS",
                options: null
            })
        } catch (exception) {
            console.log("detail controller exception : ", exception)
            next(exception);
        }
    }
    update = async (req, res, next) => {
        try {
            const data = await categorySvc.getSingleByFilter({
                _id: req.params.id
            })
            const transformData = await categorySvc.transformUpdateRequest(req, data)
            const response = await categorySvc.updateByFilter({
                _id: req.params.id
            }, transformData)

            res.json({
                detail: response,
                message: "Category update successfully",
                status: "CATEGORY_UPDATE_SUCCESS",
                options: null
            })

        } catch (exception) {
            console.log("update controller exception : ", exception)
            next(exception)
        }
    }
    delete = async (req, res, next) => {
        try {
            const data = await categorySvc.getSingleByFilter({
                _id: req.params.id
            })
            const response = await categorySvc.deleteByFilter({
                _id: req.params.id
            })
            res.json({
                detail: response,
                message: "Category delete successfully",
                status: "CATEGORY_DELETE_SUCCESS",
                options: null
            })

        } catch (exception) {
            console.log("delete controller exception : ", exception)
            next(exception);
        }
    }
    getForHome = async (req, res, next) => {
        try {
            const listCategory = await categorySvc.listAllCategory({
                skip: 0,
                limit: 10,
                filter: {
                    $and: [{ status: 'active' }]
                }
            })
            res.json({
                detail: listCategory,
                message: "Category list successfully",
                status: "CATEGORY_LIST_SUCCESS",
                options: null
            })

        } catch (exception) {
            console.log("getForHome controller exception : ", exception)
            next(exception);
        }
    }

    getDetailBySlug = async (req, res, next) => {
        try {

            const categoryDetail = await categorySvc.getSingleByFilter({
                slug: req.params.slug
            })
            let page = +req.query.page || 1;
            let limit = +req.query.limit || 10;
            let skip = (page - 1) * limit;

            let filter = {
                category: categoryDetail._id,
                status: 'active'
            }
            if (req.query.search) {
                filter = {
                    ...filter,
                    $or: [
                        { title: new RegExp(req.query.search, 'i') },
                        { description: new RegExp(req.query.search, 'i') },
                        { status: new RegExp(req.query.status, 'i') }
                    ]
                }
            }

            // let data = await eventSvc.listAllEvents({
            //     skip: skip,
            //     limit: limit,
            //     filter: filter
            // })
            // let totalCount = await eventSvc.countData(filter)

            res.json({
                detail: {
                    category: categoryDetail,
                    // events:data
                },
                message: "Category detail successfully",
                status: "CATEGORY_DETAIL_SUCCESS",
                options: {
                    currentPage: page,
                    limit: limit,
                    // totalData: totalCount
                }
            })




        } catch (exception) {
            console.log("getDetailBySlug controller exception : ", exception)
            next(exception);
        }
    }

}
const categoryCtrl = new CategoryController()
module.exports = categoryCtrl;
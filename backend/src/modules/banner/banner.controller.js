const bannerSvc = require("./banner.service")

class BannerController {

    create = async (req, res, next) => {
        try {
            const data = await bannerSvc.transformCreateRequest(req)
            const banner = await bannerSvc.createBanner(data)

            res.json({
                detail: banner,
                message: "Banner created successfully",
                status: "BANNER_CREATE_SUCCESS",
                options: null
            })

        } catch (exception) {
            console.log("Banner create controller exception ", exception)
            next(exception)
        }
    }
    index = async (req, res, next) => {
        try {
            let page = +req.query.page || 1;
            let limit = +req.query.limit || 20;
            let skip = (page - 1) * limit;

            let filter = {}
            if (req.query.search) {
                filter.$or = [
                    { title: new RegExp(req.query.search, 'i') },
                    { status: new RegExp(req.query.search, 'i') }
                ]
            }

            let data = await bannerSvc.listAllBanner({ skip, limit, filter })
            const totalCount = await bannerSvc.countData(filter)

            res.json({
                detail: data,
                message: "Banner list successfully",
                status: "BANNER_LIST_SUCCESS",
                options: {
                    currentPage: page,
                    limit: limit,
                    totalDate: totalCount,
                }
            })

        } catch (exception) {
            console.log("Banner index controller exception ", exception)
            next(exception)
        }
    }
    detail = async (req, res, next) => {
        try {
            const id = req.params.id
            const data = await bannerSvc.getSingleByFilter({
                _id: id
            })
            res.json({
                detail: data,
                message: "Banner detail successfully",
                status: "BANNER_DETAIL_SUCCESS",
                options: null
            })

        } catch (exception) {
            console.log("Banner detail controller exception ", exception)
            next(exception)
        }
    }
    update = async (req, res, next) => {
        try {
            const data = await bannerSvc.getSingleByFilter({
                _id: req.params.id
            })
            const transformData = await bannerSvc.transformUpdateRequest(req, data)
            const response = await bannerSvc.updateByFilter({
                _id: req.params.id
            }, transformData)

            res.json({
                detail: response,
                message: "Banner update successfully",
                status: "BANNER_UPDATE_SUCCESS",
                options: null
            })

        } catch (exception) {
            console.log("Banner update controller exception ", exception)
            next(exception)
        }
    }
    delete = async (req, res, next) => {
        try {
            const data = await bannerSvc.getSingleByFilter({
                _id: req.params.id
            })
            if (!data) {
                throw new Error("Banner Not found")
            }
            const response = await bannerSvc.deleteByFilter({
                _id: req.params.id
            })
            res.json({
                detail: response,
                message: "Banner delete successfully",
                status: "BANNER_DELETE_SUCCESS",
                options: null
            })

        } catch (exception) {
            console.log("Banner delete controller exception ", exception)
            next(exception)
        }
    }
    getForHome = async (req, res, next) => {
        try {
            let filter = {
                $and: [{ status: 'active' },
                { startDate: { $lte: new Date() } },
                { endDate: { $gte: new Date() } }
                ]
            }
            const listBanner = await bannerSvc.listAllBanner({
                skip: 0,
                limit: 10,
                filter: filter
            })
            res.json({
                detail: listBanner,
                message: "Banner list successfully",
                status: "BANNER_LIST_SUCCESS",
                options: null

            })

        } catch (exception) {
            console.log("Banner getForHome controller exception ", exception)
            next(exception)
        }
    }


}
const bannerCtrl = new BannerController()
module.exports = bannerCtrl
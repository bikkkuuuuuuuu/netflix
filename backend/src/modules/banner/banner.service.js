const fileUploaderSvc = require("../../services/fileuploader.service")
const BannerModel = require("./banner.model")

class BannerService {

    transformCreateRequest = async (req) => {
        try {
            let data = req.body
            if (!req.file) {
                throw { code: 400, detail: { image: "Image is required" }, message: "Validation failed", status: "VALIDATION_FAILED" }
            } else {
                data.image = await fileUploaderSvc.uploadFile(req.file.path, '/banner')
            }
            data.createdBy = req.authUser._id
            return data

        } catch (exception) {
            console.log("transformCreateRequest service exception : ", exception)
            throw exception
        }
    }
    createBanner = async (data) => {
        try {
            const bannerObj = new BannerModel(data);
            return await bannerObj.save()

        } catch (exception) {
            console.log("createBanner service exception : ", exception)
            throw exception
        }
    }
    listAllBanner = async ({ skip = 0, limit = 10, filter = {} }) => {
        try {
            let data = await BannerModel.find(filter)
                .sort({ _id: 1 })
                .skip(skip)
                .limit(limit)

            return data

        } catch (exception) {
            console.log("listAllBanner service exception : ", exception)
            throw exception
        }
    }
    countData = async (filter = {}) => {
        try {
            return await BannerModel.countDocuments(filter)

        } catch (exception) {
            console.log("countData service exception : ", exception)
            throw exception
        }
    }
    getSingleByFilter = async (filter) => {
        try {
            const data = await BannerModel.findOne(filter)
                .populate("createdBy", ["_id", "name", "email", "status", 'image'])
                .populate("updatedBy", ["_id", "name", "email", "status", 'image'])

            if (!data) {
                throw { code: 404, message: "Banner does not exist", status: "BANNER_NOT_FOUND" }
            }
            return data
        } catch (exception) {
            console.log("getSingleByFilter service exception : ", exception)
            throw exception
        }
    }
    transformUpdateRequest = async (req, bannerData) => {
        try {
            let data = req.body
            if (req.file) {
                data.image = await fileUploaderSvc.uploadFile(req.file.path, '/banner')
            } else {
                data.image = bannerData.image
            }
            data.updatedBy = req.authUser._id
            return data

        } catch (exception) {
            console.log("transformUpdateRequest service exception : ", exception)
            throw exception
        }
    }
    updateByFilter = async (filter, updateData) => {
        try {
            const response = await BannerModel.findOneAndUpdate(filter, { $set: updateData })
            return response

        } catch (exception) {
            console.log("updateByFilter service exception : ", exception)
            throw exception
        }
    }
    deleteByFilter = async (filter) => {
        try {
            const response = await BannerModel.findOneAndDelete(filter)
            return response
        } catch (exception) {
            console.log("deleteByFilter service exception : ", exception)
            throw exception
        }
    }

}
const bannerSvc = new BannerService()
module.exports = bannerSvc
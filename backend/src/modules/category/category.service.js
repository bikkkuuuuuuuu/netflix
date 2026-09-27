const { default: slugify } = require("slugify");
const fileUploaderSvc = require("../../services/fileuploader.service");
const CategoryModel = require("./category.model");

class CategoryService {

    transformCreateRequest = async (req) => {
        try {
            let data = req.body
            data.slug = slugify(data.title, {
                lower: true
            })
            if (req.file) {
                data.image = await fileUploaderSvc.uploadFile(req.file.path, '/category')
            }
            if (!data.parentId || data.parentId === '') {
                data.parentId = null
            }
            data.createdBy = req.authUser._id
            return data
        } catch (exception) {
            console.log("transformCreateRequest exception : ", exception);
            throw exception;
        }
    }
    transformUpdateRequest = async (req, categoryData) => {
        try {
            let data = req.body
            data.slug = slugify(data.title, {
                lower: true
            })
            if (req.file) {
                data.image = categoryData.image
            }
            if (!data.parentId || data.parentId === '') {
                data.parentId = null
            }
            data.updatedBy = req.authUser._id
            return data
        } catch (exception) {
            console.log("transformUpdateRequest exception : ", exception);
            throw exception;
        }
    }
    createCategory = async (data) => {
        try {
            const categoryObj = new CategoryModel(data)
            return await categoryObj.save()

        } catch (exception) {
            console.log("createCategory exception : ", exception);
            throw exception;

        }
    }
    countData = async (filter = {}) => {
        try {
            return await CategoryModel.countDocuments(filter)

        } catch (exception) {
            console.log("countData exception : ", exception);
            throw exception;
        }
    }
    listAllCategory = async ({ skip = 0, limit = 10, filter = {} }) => {
        try {
            let data = await CategoryModel.find(filter)
                .populate("parentId", ['_id', 'title', 'slug'])
                .sort({ _id: 1 })
                .skip(skip)
                .limit(limit)

            return data

        } catch (exception) {
            console.log("listAllCategory exception : ", exception);
            throw exception;
        }
    }
    getSingleByFilter = async (filter) => {
        try {
            let data = await CategoryModel.findOne(filter)
                .populate("parentId", ["_id", "title", "slug"])
                .populate("createdBy", ["_id", "name", "email", "image"])
                .populate("updatedBy", ["_id", "name", "email", "image"]);

            if (!data) {
                throw {
                    code: 404,
                    message: "Category not found",
                    status: "CATEGORY_NOT_FOUND"
                }
            }

            return data;



        } catch (exception) {
            console.log("getSingleByFilter exception : ", exception);
            throw exception;
        }

    }

    updateByFilter = async (filter, updateData) => {
        try {
            const resp = await CategoryModel.findOneAndUpdate(filter, { $set: updateData })
            return resp

        } catch (exception) {
            console.log("updateByFilter exception : ", exception);
            throw exception;

        }
    }

    deleteByFilter = async (filter) => {
        try {
            const resp = await CategoryModel.findOneAndDelete(filter)
            return resp

        } catch (exception) {
            console.log("deleteByFilter exception : ", exception);
            throw exception;
        }
    }


}
const categorySvc = new CategoryService();
module.exports = categorySvc
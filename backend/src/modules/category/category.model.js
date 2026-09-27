const { default: mongoose } = require("mongoose");
const { commonStr, schemaOpts } = require("../../common/schema");

const CategorySchema = new mongoose.Schema({
    title: {
        type: String,
        min: 3,
        max: 100,
        unique: true,
        required: true
    },
    parentId: {
        type: mongoose.Types.ObjectId,
        ref: "Category",
        default: null
    },
    slug: {
        type: String,
        unique: true,
        default: null
    },
    image: {
        type: String
    },
    ...commonStr

}, schemaOpts)

const CategoryModel = mongoose.model("Category",CategorySchema)
module.exports=CategoryModel
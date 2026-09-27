const mongoose = require("mongoose");

const SavedSchema = new mongoose.Schema({
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }

})
const SavedModel = mongoose.model("Saved", SavedSchema)
module.exports = SavedModel
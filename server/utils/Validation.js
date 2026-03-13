const mxcheck = require("mxcheck")
const mongoose = require("mongoose")

const validateEmail = async (email) => {
    const result = await mxcheck(email);
    return [result['valid'], result["suggestion"] ?? result["email"]];
}

const validateObjectId = (string) => {
    return mongoose.Types.ObjectId.isValid(string);
}

module.exports = {
    validateEmail,
    validateObjectId
}
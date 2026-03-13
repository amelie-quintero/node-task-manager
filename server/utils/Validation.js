import mxcheck from "mxcheck";
import { Types } from "mongoose";

const validateEmail = async (email) => {
    const result = await mxcheck(email);
    return [result.valid, result.suggestion ?? result.email];
}

const validateObjectId = (string) => {
    return Types.ObjectId.isValid(string);
}

export default {
    validateEmail,
    validateObjectId
}
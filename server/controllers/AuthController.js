const User = require("../models/User");
const bcrypt = require("bcrypt");
const { createAccessToken } = require("../utils/Token");
const { validateEmail } = require("../utils/Validation").default;

exports.signUp = async (req, res) => {
    try {
        const {name, email, password} = req.body;
        let missing = [];
        if (!name) missing.push("name");
        if (!email) missing.push("email");
        if (!password) missing.push("password");
        if (missing.length > 0) {
            return res.status(400).json({msg: `Missing fields: ${missing.join(", ")}`});
        }
        if (typeof name != "string" || typeof email != "string" || typeof password != "string") {
            return res.status(400).json({ msg: "Please send string values only."});
        }
        if (password.length < 8) {
            return res.status(400).json({msg: "Password must be at least 8 characters."});
        }
        if (!((await validateEmail(email)).at(0))) {
            return res.status(400).json({msg: "Invalid email address."});
        }
        const user = await User.findOne({email});
        if (user) {
            return res.status(400).json({msg: "This email is already associated with an account."});
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({name, email, password: hashedPassword});
        res.status(200).json({msg: "Account created successfully."});
    } catch (err) {
        console.error(err);
        return res.status(500).json({msg: "Internal server error."});
    }
}

exports.login = async (req, res) => {
    try {
        const {email, password} = req.body;
        if (!email || !password) {
            return res.status(400).json({status: false, msg: "Please enter all login details."});
        }
        const user = await User.findOne({email});
        if (!user) {
            return res.status(400).json({status: false, msg: "Email is not registered."});
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({status: false, msg: "Incorrect password."});
        }
        const token = createAccessToken({id: user._id});
        delete user.password;
        res.status(200).json({token, user, status: true, msg: "Login successful."});
    } catch (err) {
        console.error(err);
        return res.status(500).json({status: false, msg: "Internal server error."});
    }
}
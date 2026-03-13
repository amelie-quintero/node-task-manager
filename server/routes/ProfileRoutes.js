const express = require("express");
const router = express.Router();
const {getProfile} = require("../controllers/ProfileController");
const {verifyAccessToken} = require("../middlewares/index");

router.get("/", verifyAccessToken, getProfile);

module.exports = router;
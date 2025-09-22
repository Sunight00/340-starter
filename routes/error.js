const express = require("express")
const errorRoute = express.Router();
const errorController = require("../controllers/baseController")


errorRoute.get("/trigger-error", errorController.throwError)
module.exports = errorRoute;
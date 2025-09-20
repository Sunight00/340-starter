const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const static = require("../routes/static")

router.use(static)
/*For the Classification page*/
router.get("/type/:classificationId", invController.buildByClassificationId);
/*For the detail page*/
router.get("/detail/:id", invController.buildDetails);



module.exports = router;
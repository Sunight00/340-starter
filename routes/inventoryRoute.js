const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const static = require("../routes/static")

router.use(static)
/*For the Classification page*/
router.get("/", invController.buildManagement);
router.get("/type/:classificationId", invController.buildByClassificationId);
/*For the detail page*/
router.get("/detail/:id", invController.buildDetails);

router.get("/add-classification", invController.addClassification);

router.get("/add-inventory", invController.addInventory);



module.exports = router;
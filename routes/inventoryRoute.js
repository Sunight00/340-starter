const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const static = require("../routes/static")
const classificationValidate = require("../utilities/classification-validation")
const inventoryValidation = require("../utilities/inventory-validation")
const utilities = require('../utilities/')


router.use(static)
/*For the Classification page*/
router.get("/", invController.buildManagement);
router.get("/type/:classificationId", invController.buildByClassificationId);
/*For the detail page*/
router.get("/detail/:id", invController.buildDetails);

router.get("/add-classification", invController.addClassification);

router.get("/add-inventory", invController.addInventory, );

router.post("/add-classification", classificationValidate.classificationRules(), classificationValidate.checkRegData, utilities.handleErrors(invController.displayClassification));

router.post("/add-inventory",inventoryValidation.registationRules(), inventoryValidation.checkRegData,      utilities.handleErrors(invController.displayInventory));


module.exports = router;
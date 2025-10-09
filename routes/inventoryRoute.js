const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const static = require("../routes/static")
const classificationValidate = require("../utilities/classification-validation")
const inventoryValidation = require("../utilities/inventory-validation")
const utilities = require('../utilities/')


router.use(static)
/*For the Classification page*/
router.get("/",utilities.accountData, invController.buildManagement);

//WORKS WITH A JS FILE INVMANAGEMENT FOR REQUESTING A JSON
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))


router.get("/type/:classificationId", invController.buildByClassificationId);
/*For the detail page*/
router.get("/detail/:id", invController.buildDetails);

router.get("/add-classification",utilities.accountData, invController.addClassification);

router.get("/add-inventory",utilities.accountData, invController.addInventory, );

router.get("/edit/:inv_id", invController.editInventory )

router.get("/delete/:inv_id", invController.deleteInventory )

router.get("/feedback", invController.feedback )




router.post("/add-classification", classificationValidate.classificationRules(), classificationValidate.checkRegData, utilities.handleErrors(invController.displayClassification));

router.post("/add-inventory",inventoryValidation.registationRules(), inventoryValidation.checkRegData,      utilities.handleErrors(invController.displayInventory));

//FOR UPDATING THE INVENTORY
router.post("/update/",inventoryValidation.checkUpdateData, invController.updateInventory)

//FOR UPDATING THE INVENTORY
router.post("/delete/", invController.deletedInventory)

router.post("/feedback", invController.postFeedBack )







router.get("/inventories",invController.sendInventories)
module.exports = router;
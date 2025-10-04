const { render } = require("ejs")
const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 *  Build Each Vechicle Informations view
 * ************************** */
invCont.buildDetails = async function (req, res, next) {
  let id = req.params.id
  const data = await invModel.getIdDetails(id)
  console.log(data)
  const detail = await utilities.buildDetails(data)
  let nav = await utilities.getNav()
  res.render("./inventory/details", {title: "Vehicle Details",nav,detail}
    
  )
}

/*BUILD MANAGEMENT VIEW*/
invCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav()
    classification = await utilities.sendClassificationList()
  res.render("./inventory/management", {title: "Vehicle Management", nav, classification})
}

invCont.addClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/add-classification", {title: "Add Classification", nav, errors: null,})
}

//Add New Inventory View
invCont.addInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
    let classification = await utilities.sendClassificationList()
  res.render("./inventory/add-inventory", {title: "Add Inventory", nav, errors: null,classification })
}




invCont.displayClassification = async function (req, res, next) {
  try {
    let nav = await utilities.getNav()
    const { classification_name } = req.body
    const addClass = await invModel.addClassification(classification_name)
    let classification = await utilities.sendClassificationList()
    if (addClass) {
      req.flash(
        "notice",
        `${classification_name} has successfully been added.`
      )
      res.status(201).render("./inventory/management", {
        title: "Management",
        nav,
        classification
      })
    } else {
      req.flash("notice", "Failed to add classification.")
      res.status(500).render("./inventory/management", {
        title: "Management",
        nav,
        classification
      })
    }
  } catch (error) {
    console.error("Error adding classification:", error.message)
    next(error) // let Express handle the error
  }
}


invCont.displayInventory = async function(req, res, next){
  try{
    let nav = await utilities.getNav()
    const { classification_id,
  inv_make,
  inv_model,
  inv_description,
  inv_image,
  inv_thumbnail,
  inv_price,
  inv_year,
  inv_miles,
  inv_color, } = req.body
    let inventory = await invModel.addInventory(classification_id,
  inv_make,
  inv_model,
  inv_description,
  inv_image,
  inv_thumbnail,
  inv_price,
  inv_year,
  inv_miles,
  inv_color,)
  
  if(inventory){
        req.flash(
        "notice",
        `New inventory has been created`
      ),
      res.status(201).render("./inventory/management", {
        title: "Management",
        nav,

      })
  }
  else{
      req.flash("notice", "Failed to add classification.")
      res.status(500).render("./inventory/management", {
        title: "Management",
        nav,
      })
  }

  }
  catch(error){
        console.error("Error adding classification:", error.message)
    next(error) // let Express handle the error
  }
}

//Edit Inventory View
invCont.editInventory = async function (req, res, next) {
   const inv_id = parseInt(req.params.inv_id)
  console.log(inv_id)
  let nav = await utilities.getNav()
  const Data = await invModel.getIdDetails(inv_id)
  const itemData = Data[0]
  const className = await invModel.getClassifications()

  const okay = className.rows
  const filtered = okay.filter(item => item.classification_id === itemData.classification_id);
  console.log(filtered)
  let classification = await utilities.sendClassificationList()
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  console.log(itemData.classification_id)
  res.render("./inventory/edit-inventory", {title:"Edit " + itemName,
     nav, 
    errors: null,
    classification,
    classification_name:filtered[0].classification_namee,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    //classification_id: itemData.classification_id,
      
    })
}



/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body
  const updateResult = await invModel.updateInventory(
    inv_id,  
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model

    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const classification = await utilities.classification(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classification,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
    })
  }
}




//Edit Inventory View
invCont.deleteInventory = async function (req, res, next) {
   const inv_id = parseInt(req.params.inv_id)
  console.log(inv_id)
  let nav = await utilities.getNav()
  const Data = await invModel.getIdDetails(inv_id)
  const itemData = Data[0]
  const className = await invModel.getClassifications()

  const okay = className.rows
  const filtered = okay.filter(item => item.classification_id === itemData.classification_id);
  console.log(filtered)
  let classification = await utilities.sendClassificationList()
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  console.log(itemData.classification_id)
  res.render("./inventory/delete-inventory", {title:"Delete " + itemName,
     nav, 
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_price: itemData.inv_price,

    //classification_id: itemData.classification_id,
      
    })
}



invCont.deletedInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_price
  } = req.body
  const deletedResult = await invModel.deleteInventoryItem(
    inv_id,  
  )

  if (deletedResult) {
    const itemName = inv_make + " " + inv_model

    req.flash("notice", `The ${itemName} was successfully Deleted.`)
    res.redirect("/inv/")
  } else {
    const classification = await utilities.classification(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/delete-inventory", {
    title: "Delete " + itemName,
    nav,
    classification,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_price

    })
  }
}




/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */

invCont.sendInventories = async function (req, res){
  try{
    const inventories = await  invModel.inventories()
    res.json(inventories);
    }
  catch (err){
    res.status(500).json({ error: "Failed to fetch classifications" });
  }
}



module.exports = invCont
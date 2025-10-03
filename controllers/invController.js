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

    if (addClass) {
      req.flash(
        "notice",
        `${classification_name} has successfully been added.`
      )
      res.status(201).render("./inventory/management", {
        title: "Management",
        nav,
      })
    } else {
      req.flash("notice", "Failed to add classification.")
      res.status(500).render("./inventory/management", {
        title: "Management",
        nav,
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
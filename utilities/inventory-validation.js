const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}

validate.registationRules = () => {
    return [
      // firstname is required and must be string
      body("classification_id")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Please provide a classification name."), // on error this message is sent.
  
      // lastname is required and must be string
      body("inv_make")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 3 })
        .withMessage("Please provide an Inventory name"), // on error this message is sent.
  
        // valid email is required and cannot already exist in the database
        body("inv_model")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 3 })
        .withMessage("Please provide an Inventory model"),
        
  
      // password is required and must be strong password
      body("inv_description")
        .trim()
        .notEmpty()
        .isLength({ min: 3 })
        .withMessage("Provide a valid description"),

        
    body("inv_price")
        .trim()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Provide price"),

    body("inv_year")
        .trim()
        .notEmpty()
        .isLength({ min: 4 })
        .isLength({ max: 4 })
        .withMessage("Please provide a valid year"),

    body("inv_miles")
        .trim()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Miles value is needed"),

    body("inv_color")
        .trim()
        .notEmpty()
        .isLength({ min: 3 })
        .withMessage("Color of vechile should be included"),

    ]
  }

validate.checkRegData = async (req, res, next) => {
  const { classification_id, inv_make, inv_model, inv_description, inv_price, inv_year, inv_miles, inv_color } = req.body
  let errors = []
  let classification = await utilities.sendClassificationList()
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("./inventory/add-inventory", {
      errors,
      title: "Add Inventory",
      nav,
      classification,
    classification_id, 
    inv_make, 
    inv_model, 
    inv_description, 
    inv_price, 
    inv_year, 
    inv_miles, 
    inv_color, 
    })
    return
  }
  next()
}







module.exports = validate
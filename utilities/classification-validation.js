const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}

validate.classificationRules = function (){
    return[
        body("classification_name")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 3 })
        .withMessage("Provide an appropriate classification name (min 3 letters)"), // on error this message is sent.
    ]
}


  /* ******************************
 * Check data and return errors or continue to insert the classification
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
  const {classification_name} = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("./inventory/add-classification", {
      errors,
      title: "Add Classification",
      nav,
      classification_name,
    })
    return
  }
  next()
}










module.exports = validate;
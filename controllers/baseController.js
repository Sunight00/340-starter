const utilities = require("../utilities/")
const baseController = {}

baseController.buildHome = async function(req, res){
  const nav = await utilities.getNav()
  res.render("index", {title: "Home", nav })
}


/*THIS IS FOR INTENTIONAL ERROR TESTING PURPOSES ONLY*/

baseController.throwError = (req, res, next) => {
  try {
    // Force an intentional error
    throw new Error("This is a test 500 error!")
  } catch (err) {
    next(err) // Pass the error to Express error-handling middleware
  }
}


module.exports = baseController
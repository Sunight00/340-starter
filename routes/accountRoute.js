const express = require("express")
const router = new express.Router() 
const utilities = require('../utilities/')
const accountController = require("../controllers/accountController")
const regValidate = require('../utilities/account-validation')

router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildManagement))

router.get('/login',utilities.handleErrors(accountController.buildLogin))

/*Registration route*/
router.get("/register",utilities.handleErrors(accountController.buildRegister))


router.get("/update", utilities.checkLogin, utilities.handleErrors(accountController.updateView))

router.get("/logout", utilities.handleErrors(accountController.accountLogout))



// Process the login attempt
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)

router.post(
  "/update",regValidate.UpdateRules(),regValidate.checkUpdate, utilities.handleErrors(accountController.updateAccount)
)

router.post(
  "/update",regValidate.passwordRules(),regValidate.checkPassword, utilities.handleErrors(accountController.changePassword)
)


module.exports = router
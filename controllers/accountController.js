const utilities = require("../utilities/")
const accountController = {}
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const { render } = require("ejs")
const Util = require("../utilities/")
require("dotenv").config()
/* ****************************************
*  Deliver login view
* *************************************** */
accountController.buildLogin = async function (req, res, next) {
  let nav = await utilities.getNav()
  req.flash()
  res.render("account/login", {
    title: "Login",
    nav,
    errors:null
  })
};



accountController.buildRegister = async function(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null
  })
}



/* ****************************************
*  Process Login
* *************************************** */
/* ****************************************
 *  Process login request
 * ************************************ */
accountController.accountLogin = async function (req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      //return res.redirect("/account/")
      if (accountData.account_type === "Employee" || accountData.account_type === "Admin") {
      res.status(201).render("account/management", {
      title: "Account Management",
      nav,
      inventory: `<h3>INVENTORY MANAGEMENT</h3>`,
      firstName: accountData.account_firstname,
      inventoryLink: '<p><a href="/inv/">Inventory Management</a></p>'
    })
    } else {
      res.status(201).render("account/management", {
      title: "Account Management",
      nav,
      inventory: null,
      firstName: accountData.account_firstname, 
      inventoryLink: null,
    })
    }}
    else {
      req.flash("message notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    throw new Error('Access Forbidden')
  }
}

/* ****************************************
*  Process Registration
* *************************************** */
accountController.registerAccount = async function (req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body
  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      error : null
    })
  }
  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors : null
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      errors : null
    })
  }
}



accountController.updateView = async function (req, res, next) {
  let nav = await utilities.getNav()
  //const account_id = req.accountData.account_id
  //const accountData = await accountModel.getAccountById(account_id)
  const account_firstname  = await utilities.fName(req, res, next)
  const account_lastname  = await utilities.lName(req, res, next)
  const account_email  = await utilities.email(req, res, next)
  const account_id  = await utilities.iD(req, res, next)

  res.render("account/update", {
    title: "Update Account",
    nav,
    errors: null,
    account_firstname: account_firstname,
    account_lastname: account_lastname,
    account_email: account_email,
    account_id: account_id
  })
}
 
accountController.updateAccount = async function (req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_id } = req.body

  const updated = await accountModel.updateAccount(account_firstname, account_lastname, account_email, account_id)
  try{
  if (updated) {
    req.flash("notice", `Your account has been successfully updated.`)
    res.status(201).render("account/management", {
      title: "Account Management",
      nav,
      inventory: null,
      firstName: account_firstname, 
      inventoryLink: null,
    })
  } else {
    req.flash("notice", "Sorry, the update failed.")
    res.status(501).render("account/update", {
      title: "Update Account",
      nav,
      errors: null,
      account_firstname: account_firstname,
      account_lastname: account_lastname,
      account_email: account_email
    })
  }
} catch (error) {
    throw new Error('Access Forbidden')
  }
}

/* CHANGE PASSWORD*/
accountController.changePassword = async function (req, res) {
  let nav = await utilities.getNav()  
  const { account_password, account_id } = req.body
  const ch = await accountModel.changePassword(account_password,account_id)
  if (ch) {
        req.flash("notice", `Your password has been successfully updated.`)
    res.status(201).render("account/management", {
      title: "Account Management",
      nav,
      inventory: null,
      firstName: account_firstname, 
      inventoryLink: null,
    })
  }

}




module.exports = accountController 
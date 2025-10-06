const invModel = require("../models/inventory-model")
const Util = {}
const jwt = require("jsonwebtoken")
require("dotenv").config()
/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul id='navLinks'>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

Util.sendClassificationList = async function(){
  let data = await invModel.getClassifications()
  return data
}






/* **************************************
* Build the classification view HTML
* ************************************ */
/*Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}*/

Util.buildClassificationGrid = async function (data) {
  let grid = ""

  if (data.length > 0) {
    grid = `<ul id="inv-display">`

    data.forEach(vehicle => {
      grid += `
        <li>
          <a href="../../inv/detail/${vehicle.inv_id}" 
             title="View ${vehicle.inv_make} ${vehicle.inv_model} details">
            <img src="${vehicle.inv_thumbnail}" 
                 alt="Image of ${vehicle.inv_make} ${vehicle.inv_model} on CSE Motors" />
          </a>
          <div class="namePrice">
            <hr />
            <h2>
              <a href="../../inv/detail/${vehicle.inv_id}" 
                 title="View ${vehicle.inv_make} ${vehicle.inv_model} details">
                ${vehicle.inv_make} ${vehicle.inv_model}
              </a>
            </h2>
            <span>
              $${new Intl.NumberFormat("en-US").format(vehicle.inv_price)}
            </span>
          </div>
        </li>`
    })
    grid += `</ul>`
  } else {
    grid = `<p class="notice">Sorry, no matching vehicles could be found.</p>`
  }

  return grid
}

Util.buildDetails = async function(data){
  let detail = ''
  if(data.length > 0){
    data.forEach(info => { 
      detail += `
        <div class="vehicle-details">
          <div class="card">
            <h1>${info.inv_year} ${info.inv_make} ${info.inv_model}</h1>
            <img src="${info.inv_image}" alt="Image of ${info.inv_year} ${info.inv_make} ${info.inv_model}" >
            <div class="details">
                <h2>${info.inv_make} ${info.inv_model} Details</h2>
                <h2>Price: <span>$${new Intl.NumberFormat('en-US').format(info.inv_price)}</span></h2>
                <h2>Description: <span>${info.inv_description}</span></h2>
                <h2>Color: <span>${info.inv_color}</span></h2>
                <h2>Miles: <span>${new Intl.NumberFormat('en-US').format(info.inv_miles)} miles</span></h2>
            </div>
          </div>
        </div>
      `})
} else { 
    detail += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return detail}





/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
 if (req.cookies.jwt) {
  jwt.verify(
   req.cookies.jwt,
   process.env.ACCESS_TOKEN_SECRET,
   function (err, accountData) {
    if (err) {
     req.flash("notice","Please log in")
     res.clearCookie("jwt")
     return res.redirect("/account/login")
    }
    res.locals.accountData = accountData
    res.locals.loggedin = 1
    next()
   })
 } else {
  next()
 }
}

/* ****************************************
 *  Check Login
 * ************************************ */
 Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
 }


// Middleware to check and decode JWT
Util.accountData = (req, res, next) => {
  const token = req.cookies.jwt
  if (!token) {
    console.log("❌ No token found.")
    res.locals.loggedin = false
    return next()
  }

  try {
    console.log("🔍 Token found, decoding...")
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    // Store decoded user info for easy access
    res.locals.loggedin = true
    res.locals.accountData = decoded
    req.accountData = decoded
    console.log("✅ User:", req.accountData.account_firstname)
    console.log("🧩 Type:", req.accountData.account_type)

    if (decoded.account_type === "Employee" || decoded.account_type === "Admin") {
      next()
    } else {
      req.flash("notice", "You do not have permission to access that page.")
      return res.redirect("/")
    }
  } catch (error) {
    console.error("⚠️ JWT verification failed:", error.message)
    //res.clearCookie("jwt")
    //res.locals.loggedin = false
    next()
  }
}
















/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next) 

module.exports = Util
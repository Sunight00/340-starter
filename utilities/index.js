
const invModel = require("../models/inventory-model")
const Util = {}

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


module.exports = Util



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
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next) 
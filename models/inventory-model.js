const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}



/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}


async function getIdDetails(id){
  try {
    const details = await pool.query(
      `SELECT * FROM public.inventory WHERE inv_id = $1;`,
      [id]
    )
    return details.rows
  } catch (error) {
    console.error("getIdDetails error " + error)
  }
}


/*ADDING CLASSIFICATION*/
async function addClassification(classification_name) {
  try {
    const sql = "INSERT INTO classification (classification_name) VALUES ($1) RETURNING *;"
    const result = await pool.query(sql, [classification_name])
    return result.rowCount
  } catch (error) {
    console.error("Error inserting classification:", error.message)
    throw error
  }
}

module.exports = {getClassifications, getInventoryByClassificationId, getIdDetails, addClassification}
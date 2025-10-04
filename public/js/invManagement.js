const classification_id = document.getElementById("classification_id")
const inventoryDisplay = document.getElementById("inventoryDisplay")

async function o(){
    const response = await fetch ("/api/inventories")
    const data = await response.json()

    classification_id.addEventListener("change", (event) => {
    const selectedValue = parseInt(event.target.value);
    const filtered = data.filter(item => item.classification_id === selectedValue);
    console.log(filtered)
    
    if (filtered.length === 0) {
      inventoryDisplay.innerHTML = "<p>No vehicles found for this classification.</p>";
      return;
    }

    let dataTable = '<thead>'; 
    dataTable += '<tr><th>Vehicle Name</th><td>&nbsp;</td><td>&nbsp;</td></tr>'; 
    dataTable += '</thead>'; 
 
    dataTable += '<tbody>'; 

    filtered.forEach(function (element) { 
    console.log(element.inv_id + ", " + element.inv_model); 
    dataTable += `<tr><td>${element.inv_make} ${element.inv_model}</td>`; 
    dataTable += `<td><a href='/inv/edit/${element.inv_id}' title='Click to update'>Modify</a></td>`; 
    dataTable += `<td><a href='/inv/delete/${element.inv_id}' title='Click to delete'>Delete</a></td></tr>`; 
    }) 
    dataTable += '</tbody>'; 
 // Display the contents in the Inventory Management view 
 inventoryDisplay.innerHTML = dataTable;})
}
o()

/*
ROUTE
 router.get("/inventories",invController.sendInventories)

CONTROLLER
invCont.sendInventories = async function (req, res){
  try{
    const inventories = await  invModel.inventories()
    res.json(inventories);
    }
  catch (err){
    res.status(500).json({ error: "Failed to fetch classifications" });
  }
}

SERVER
app.use("/api", require("./routes/inventoryRoute"));


MODEL
 async function inventories() {
  try {
    const sql = "SELECT * FROM inventory"
    const result = await pool.query(sql)
    return result.rows
  } catch (error) {
    console.error("Error inserting classification:", error.message)
    throw error
  }
 }
*/

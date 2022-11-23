/** load express js */
const express = require(`express`)

/** create object of express */
const app = express()

/** allow route to read urlencoded data */
app.use(express.urlencoded({ extended: true }))

/** load obat controller */
const adminController = require(`../controllers/admin.controller`)

// load authorization from middleware
const authorization = require(`../middleware/authorization`)

/** create route for access obat's data */
app.get("/",authorization.cekUser,adminController.showDataAdmin)

/** create route for show add obat view */
app.get("/add",authorization.cekUser, adminController.showAddPage)

/** create route for process of add new obat */
app.post("/add",authorization.cekUser, adminController.processInsert)

/** create route for show edit obat view */
app.get("/edit/:id",authorization.cekUser, adminController.showEditPage)
/** :id -> name of paramter URL */

/** create route for process edit obat */
app.get("/edit/:id",authorization.cekUser, adminController.processUpdate)

app.post("/edit/:id",authorization.cekUser, adminController.processUpdate)
    
/** create route for process delete obat */
app.get("/delete/:id",authorization.cekUser, adminController.processDelete)

/** create route for process delete obat */
app.post("/delete/:id",authorization.cekUser, adminController.processDelete)

/** export object "app" to another file */
module.exports = app
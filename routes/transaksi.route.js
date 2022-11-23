/** load express js */
const express = require(`express`)

/** create object of express */
const app = express()

/** load obat controller */
const transaksiController = require(`../controllers/transaksi.controller`)

/** allow route to read urlencoded data */
app.use(express.urlencoded({ extended: true }))

// load authorization from middleware
const authorization = require(`../middleware/authorization`)

/** create route for access obat's data */
app.get("/add", authorization.cekUser ,transaksiController.showFormTransaksi)

// route untuk menyimpan data transkasi
app.post(`/add`, authorization.cekUser, transaksiController.simpanTransaksi)

// route untuk menampilkan data transaksi nya
app.get(`/`, authorization.cekUser, transaksiController.showTransaksi)

// route untuk menghapus data transaksi
app.get(`/:id`, authorization.cekUser, transaksiController.hapusTransaksi)

/** export object "app" to another file */
module.exports = app
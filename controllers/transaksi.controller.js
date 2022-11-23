// memanggil model obat
const telurModel = require(`../models/telur.model`)
const packModel = require(`../models/pack.model`)

// memanggil model customer
const memberModel = require(`../models/member.model`)
const { json, response } = require("express")

// memanggil model transaksi
const transaksiModel = require(`../models/transaksi.model`)

// memanggil modele detai transaksi
const detailModel = require(`../models/detail_transaksi.model`)
const { request } = require("../routes/transaksi.route")

// function untuk menampilkan form transaksi
exports.showFormTransaksi = async(request, response) => {
    try {
        // ambil data telur dan pack
        let telur = await telurModel.findAll()
        let pack = await packModel.findAll()
        // ambil member
        let member = await memberModel.findAll()
        // prepare datta yang akan di passing ke view
        let sendData = {
            dataTelur: telur,
            dataPack: pack,
            dataMember: member,
            page: `form-transaksi`,
            tgl_transaksi:``,
            dataTelurString: JSON.stringify(telur),
            dataPackString: JSON.stringify(pack),
            // JSON = JavaStringObjectNotasion
            dataUser: request.session.dataUser,
            cart: request.session.cart
        }
        return response.render(`../views/index`, sendData)
    } catch (error) {
        let sendData = {
            message: error
        }
        return response.render(`../views/error-page`, sendData)
    }
}

//  membuat fungsi untuk menambahkan obat ke keranjang
exports.addToCart = async(request,response) => {
    try {
        // dapetin data telur berdasarkan id telur yang dikirim kan
        let selectedTelur = await telurModel.findByCriteria({
            id: request.body.id_telur
        })

        let selectedPack = await packModel.findByCriteria({
            id: request.body.id_pack
        })
        
        // tampung / receive data yang dikirim kan 
        let storeData = {
            id_telur : request.body.id_telur,
            jenis_telur: selectedTelur[0].jenis_telur,
            jumlah_telur : request.body.jumlah_telur,
            harga_telur : request.body.harga_telur,
            id_pack : request.body.id_pack,
            nama_pack : selectedPack[0].nama_pack,
            jumlah_pack : request.body.jumlah_pack,
            harga_pack : request.body.harga_pack
        } 

        // masukkan data ke keranjang menggunakan session
        request.session.cart.push(storeData)
        // push() -> menambah data ke dalam array

        // direct ke halaman ke form transaksi
        return response.redirect(`/transaksi/add`) 

    } catch (error) {
        let sendData = {
            message: error
        }
        return response.render(`../views/error-page`, sendData)
    }
}

// membuat function untuk menghapus data item pada cart (keranjang)
exports.hapusCart = async (request,response) => {
    try {
        // ambil seluruhu data cart pada session
        let cart = request.session.cart

        // ambil id obat yang akan di hapus dari cart
        let id_telur = request.params.id

        // cari tau posisi index dari data yang akan di hapus
        let index = cart.findIndex(item => item.id_telur == id_telur)

        // hapus data sesuai index yang di temukan
        cart.splice(index, 1)
        // splice utuk menghapus data pada array

        // kembalikan lagi data cart ke dalam session
        request.session.cart = cart

        // direct ke halaman form transaksi
        return response.redirect(`/transaksi/add`)

    } catch (error) {
        let sendData = {
            message: error
        }
        return response.render(`../views/error-page`, sendData)
    }    
}

// menyimpan data transaksi
exports.simpanTransaksi = async(request, response) => {
    try {
        //tampung data yang dikirimkan 
        let newTransaksi = {
            tgl_transaksi: request.body.tgl_transaksi,
            id_member: request.body.id_member,
            id_admin: request.session.dataUser.id
        }

        // simpan transaksi 
        let resultTransaksi = await transaksiModel.add(newTransaksi)

        // manampung isi cart
        let cart = request.session.cart

        for (let i = 0; i < cart.length; i++) {
         // hapus dulu dari key"nama_pack dan jenis_telur" dari cart
        delete cart[i].jenis_telur
        delete cart[i].nama_pack
        
        // tambah key "id_transaksi" ke dalam cart
        cart[i].id_transaksi = resultTransaksi.insertId

        // eksekusi simpan cart ke detail_transaksi
        await detailModel.add(cart[i])
        }

        // hapus cart nya
        request.session.cart = []

        // direct ke halaman form transaksi lagi
        return response.redirect(`/transaksi/add`)
        
    } catch (error) {
        let sendData = {
            message: error
        }
        return response.render(`../views/error-page`, sendData)
    }
}

// fungsi untuk menampilkan data transaksi
exports.showTransaksi = async(request, response) => {
    try {
        
        // ambil data transaksi 
        let transaksi = await transaksiModel.findAll()

        // sisipin data detail dari setiap transaksi
        for (let i = 0; i < transaksi.length; i++) {
            // kita ambil id transaksi nya
            let id = transaksi[i].id

            // ambil data detailnya sesuai id
            let detail = await detailModel.findByCriteria({ id_transaksi:id })

            // sisipin detail ke transaksi nya
            transaksi[i].detail = detail
        }

        // prepare data yang akan dikirimkan ke view
        let sendData = {
            page: `transaksi`,
            dataUser: request.session.dataUser,
            transaksi: transaksi
        }

        return response.render(`../views/index`, sendData)

    } catch (error) {
        let sendData = {
            message: error
        }
        return response.render(`../views/error-page`, sendData)
    }
}

// function untuk menghapus data transaksi
exports.hapusTransaksi = async(request, response) => {
    try {
        
        // menampung data id yang akan di hapus
        let id = request.params.id

        // menghaspus data detail transaksi nya dulu
         await detailModel.delete({id_transaksi : id})

        //  menghapus data transaksi nya
        await transaksiModel.delete({id : id})

        // kembali lagi ke halaman transaksi
        return response.redirect(`/transaksi`)

    } catch (error) {
        let sendData = {
            message: error
        }
        return response.render(`../views/error-page`, sendData)
    }
}
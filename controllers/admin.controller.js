/** load model's file of obat */
const adminModel = require(`../models/admin.model`)

/** LOAD crypt js */
const crypt = require(`../crypt`)

/** -------------------------------------
 * create function to handle request
 * with url: /obat/ with method GET
 */
exports.showDataAdmin = async (request, response) => {
    try {
        /** get data obat using model */
        let dataAdmin = await adminModel.findAll()

        /** send data to view */
        let sendData = {
            page: `admin`,
            data: dataAdmin,
            dataUser: request.session.dataUser
        }

        /** set view page for this function */
        return response.render(`../views/index`, sendData)
        
    } catch (error) {
        /** handling error */
        let sendData = {
            message: error
        }
        return response.render(`../views/error-page`, sendData)
    }
}

exports.showAddPage = (request, response) => {
    let sendData = {
        page: `form-admin`, // page that will be show
        /** set empty data because this is add feature */
        nama_admin: ``,
        username: ``,
        password:``,
        dataUser: request.session.dataUser,
        /** set target route for submit filled data */
        targetRoute: `/admin/add`,
        deskripsi: crypt.deskripsi
    }

    /** set view page for this function */
    return response.render(`../views/index`, sendData)
}

exports.processInsert = async (request, response) => {
    try {
        /** reading obat's data from user that has sent */
        let newAdmin = {
            nama_admin: request.body.nama_admin,
            username: request.body.username,
            password: crypt.enkripsi(request.body.password)
        }

        /** call function for insert to table of obat */
        await adminModel.add(newAdmin)

        /** redirect to obat's page */
        return response.redirect(`/admin`)

    } catch (error) {
        /** handling error */
        let sendData = {
            message: error
        }
        return response.render(`../views/error-page`, sendData)
    }
}

exports.showEditPage = async (request, response) => {
    /** read selected ID from URL parameter */
    let selectedID = request.params.id

    /** store selected ID to object "parameter" */
    let parameter = {
        id: selectedID // 'id' is similar as column's name of table
    }

    /** call function for get data from database based on seleced id */
    let selectedData = await adminModel.findByCriteria(parameter)

    /** prepare data to send to view page  */
    let sendData = {
        page: `form-admin`, // page that will be show
        /** set each data based on data that will be change */
        nama_admin: selectedData[0].nama_admin,
        username: selectedData[0].username,
        password: selectedData[0].password,
        dataUser: request.session.dataUser,
        deskripsi: crypt.deskripsi,
        
        /** set target route for submit filled data */
        targetRoute: `/admin/edit/${selectedID}`
        
    }

    /** set view page for this function */
    return response.render(`../views/index`, sendData)

}

exports.processUpdate = async (request, response) => {
    try {
        /** read selected ID from URL parameter */
        let selectedID = request.params.id

        /** store selected ID to object "parameter" */
        let parameter = {
            id: selectedID // 'id' is similar as column's name of table
        }

        /** reading obat's data from user that has sent */
        let newAdmin = {
            nama_admin: request.body.nama_admin,
            username: request.body.username,
            password: crypt.enkripsi(request.body.password)
        }

        /** call function for update to table of obat */
        await adminModel.update(newAdmin, parameter)

        /** redirect to obat's page */
        return response.redirect(`/admin`)

    } catch (error) {
        /** handling error */
        let sendData = {
            message: error
        }
        return response.render(`../views/error-page`, sendData)
    }
}

exports.processDelete = async (request, response) => {
    try {
        /** read selected ID from URL parameter */
        let selectedID = request.params.id

        /** store selected ID to object "parameter" */
        let parameter = {
            id: selectedID // 'id' is similar as column's name of table
        }

        /** call function for delete data table of obat */
        await adminModel.delete(parameter)

        /** redirect to obat's page */
        return response.redirect(`/admin`)

    } catch (error) {
        /** handling error */
        let sendData = {
            message: error
        }
        return response.render(`../views/error-page`, sendData)
    }
}


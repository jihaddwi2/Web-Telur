const connection = require(`../config`)

/** set table name to manage in this model file */
const tableName = `admin`

/** create and export 
/** function to get data from table */
exports.findAll = () => {
    return new Promise((resolve, rejected) => {
        /** define query to get all data */
        let query = `select * from admin`

        /** run query */
        connection.query(query, (error, result) => {
            if (error) {
                /** reject with error message */
                rejected(error)
            }

            /** return resolve with data */
            resolve(result)
        })
    })
}

/** create and export 
  * function to get data from table with specific criteria */
exports.findByCriteria = (parameter) => {
    return new Promise((resolve, rejected) => {
        /** ----------------------------------------------
         * arrange list of parameter's keys and its value as string */
        let params = Object
            .keys(parameter)
            .map(key => `${key}="${parameter[key]}"`)
            .join(` and `)

        /** define query to get all data */
        let query = `select * from ${tableName} where ${params}`

        /** run query */
        connection.query(query, (error, result) => {
            if (error) {
                /** reject with error message */
                rejected(error)
            }

            /** return resolve with data */
            resolve(result)
        })
    })
}

exports.add = (dataObject) => {
    return new Promise((resolve, rejected) => {

        /** ----------------------------------------------
         * arrange list of dataObject's key as string */
        let columns = Object
            .keys(dataObject)
            .join()

        /** ---------------------------------------------- 
         * arrange list of dataObject's values as string */
        let values = Object.values(dataObject)
            .map(value => `"${value}"`)
            .join()

        /** create query for insert */
        let query = `insert into ${tableName} (${columns}) values (${values})`

        /** show query as log in console */
        console.log(`Run: ${query}`)

        /** run query */
        connection.query(query, (error, result) => {
            if (error) {
                /** reject with error message */
                rejected(error.message)
            }

            /** return resolve with data */
            resolve(result)
        })
    })
}

exports.update = (dataObject, parameter) => {
    return new Promise((resolve, rejected) => {

        /** ----------------------------------------------
         * arrange list of dataObject's keys and its values as string */
        let updateData = Object
            .keys(dataObject)
            .map(key => `${key}="${dataObject[key]}"`)
            .join()

        /** ----------------------------------------------
         * arrange list of parameter's keys and its value as string */
        let params = Object
            .keys(parameter)
            .map(key => `${key}="${parameter[key]}"`)
            .join(" and ")

        /** create query for update */
        let query = `update ${tableName} set ${updateData} where ${params}`

        /** show query as log in console */
        console.log(`Run: ${query}`)

        /** run query */
        connection.query(query, (error, result) => {
            if (error) {
                /** reject with error message */
                rejected(error.message)
            }

            /** return resolve with data */
            resolve(result)
        })
    })
}

exports.delete = (parameter) => {
    return new Promise((resolve, rejected) => {
        /** -----------------------------------------
         * parameter contain data like this:
         * parameter = {
         *      id: '1'
         * }
         * 
         * to create Query for update data, we have to
         * arrange every key and its value of parameter
         * to be string
         * ----------------------------------------------
         */

        /** ----------------------------------------------
         * arrange list of parameter's keys and its value as string */
        let params = Object
            .keys(parameter)
            .map(key => `${key}="${parameter[key]}"`)
            .join(" and ")
        /** result:
         * params = ' id="1" '
         * ------------------------------------------------
         */

        /** create query for delete */
        let query = `delete from ${tableName} where ${params}`

        /** show query as log in console */
        console.log(`Run: ${query}`)

        /** run query */
        connection.query(query, (error, result) => {
            if (error) {
                /** reject with error message */
                rejected(error.message)
            }

            /** return resolve with data */
            resolve(result)
        })
    })
}

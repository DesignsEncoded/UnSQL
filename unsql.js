
class UnSQL {

    static find({ select = '*', alias = null, join = null, where = null, whereOr = null, junction = 'AND', groupBy = null, having = null, orderBy = null, orderDirection = 'DESC', rowCount = null, offset = null }) {
        return new Promise((resolve, reject) => {
            let sql = `SELECT ${select} FROM ${this.TABLE_NAME} `

            if (alias != null) sql += ` ${alias} `

            if (join != null) {
                for (let i = 0; i < join.length; i++) {
                    sql += ` ${join[i].type} JOIN ${join[i].table} ON ${join[i].on} `
                }
            }

            if (where != null || whereOr != null) {

                sql += ' WHERE '

                if (where)
                    sql += ` (${where.map(condition => condition.join(' ')).join(' AND ')}) `

                if (where && whereOr)
                    sql += ` ${junction ? junction : 'AND'} `

                if (whereOr)
                    sql += ` (${whereOr.map(condition => condition.join(' ')).join(' OR ')}) `

            }

            if (groupBy != null) {
                sql += ` GROUP BY ${groupBy} `
            }

            if (having != null) {
                sql += ` HAVING ${having} `
            }

            if (orderBy != null) {
                sql += ` ORDER BY ${orderBy} `
                if (['ASC', 'DESC'].includes(orderDirection.toUpperCase())) sql += ` ${orderDirection} `
            }


            if (!isNaN(parseInt(rowCount)) && !isNaN(parseInt(offset))) {
                sql += ` LIMIT ${rowCount} OFFSET ${offset} `
            } else if (!isNaN(parseInt(rowCount)) && isNaN(parseInt(offset))) {
                sql += ` LIMIT ${rowCount} `
            }

            try {
                this.POOL.query(sql, (error, result) => {
                    if (error) {
                        console.log('error while fetching data', error)
                        return reject({ success: false, error: error })
                    }
                    return resolve({ success: true, result: result })
                })
            } catch (error) {
                return reject({ success: false, error })
            }
        })
    }

    static save({ alias = null, data, updateObj = null, where = null, whereOr = null, junction = 'AND' }) {
        return new Promise((resolve, reject) => {
            let sql = ''

            if (where != null || whereOr != null) {

                sql = `UPDATE ${this.TABLE_NAME + (alias != null ? " " + alias : '')} SET ? WHERE `

                if (where)
                    sql += ` (${where.map(condition => condition.join(' ')).join(' AND ')}) `

                if (where && whereOr && junction)
                    sql += ` ${junction ? junction : 'AND'} `

                if (whereOr)
                    sql += ` (${whereOr.map(condition => condition.join(' ')).join(' OR ')}) `

            } else {
                sql = `INSERT INTO ${this.TABLE_NAME + (alias != null ? " " + alias : "")} SET ? `

                if (updateObj != null) {
                    sql += ' ON DUPLICATE KEY UPDATE ? '
                    data = [data, updateObj]
                }

            }

            try {
                this.POOL.query(sql, data, (error, result) => {
                    if (error) {
                        console.log('error while saving', error)
                        return reject({ success: false, error: error })
                    }

                    return resolve({ success: true, insertID: result.insertId })
                })
            } catch (error) {
                return reject({ success: false, error })
            }
        })
    }

    static del({ alias = null, where = null, whereOr = null, junction = 'AND' }) {
        return new Promise((resolve, reject) => {
            let sql = `DELETE FROM ${this.TABLE_NAME + (alias != null ? ' ' + alias : '')} `

            if (where != null || whereOr != null) {

                sql += ' WHERE '

                if (where)
                    sql += ` (${where.map(condition => condition.join(' ')).join(' AND ')}) `

                if (where && whereOr)
                    sql += ` ${junction ? junction : 'AND'} `

                if (whereOr)
                    sql += ` (${whereOr.map(condition => condition.join(' ')).join(' OR ')}) `

            }

            try {
                this.POOL.query(sql, (error, result) => {
                    if (error) {
                        console.log('error while deleting', error)
                        return reject({ success: false, error: error })
                    }

                    return resolve({ success: true, insertID: result.insertId })
                })
            } catch (error) {
                return reject({ success: false, error })
            }
        })
    }

}

module.exports = UnSQL
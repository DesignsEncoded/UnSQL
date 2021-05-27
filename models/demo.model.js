const Repo = require('../repos/mysql.repo.js')

const tableName = 'enter_table_name_here'

// Used for Create and Update operations
async function save({ table = tableName, data, where = null }) {
    return await Repo.save({ table, data, where })
}

// Used for Read operation
async function find({ select = "*", from = tableName, where = null, whereOr = null, join = null, limit = 12, startID = null, offset = null, groupBy = null }) {
    return await Repo.find({ select, from, where, whereOr, join, limit, startID, offset, groupBy })
}

// Used for Delete operation
async function del({ table = tableName, where = null, whereOr = null }) {
    return await Repo.del({ table, where, whereOr })
}

module.exports = { save, find, del }

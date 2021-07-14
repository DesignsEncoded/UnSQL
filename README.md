
# UnSQL

UnSQL is a library, written in javascript. It provides for a modern way to interact with the **MySQL** databases. It provides simple yet very powerful interface that uses common javascript data forms like objects and arrays to define different query parameters and execute MySQL commands (with any level of complexity) without actually writting a single line of SQL. It automaticlly generates the structured query in the background and also takes care of the transactions, rollbacks and gracefull termination.

It also supports the option to enter structured SQL into the parameters for even more complex querying purposes.

## Features

- Promise based
- Light weight
- No predefined schema required
- Supports object oriented programing
- Supports functional programing
- Supports MySQL connection pool
- Built-in Structured Query Generator
- Supports structured queries as value for several of its parameters 
- Built-in transactions for each query
- Graceful handling of errors and exceptions
- Query success or failure acknowlegement
- Returns result as JSON object
  
## Installation 

Install **UnSQL** with npm

```bash 
  npm install unsql
```
OR

```bash 
  npm i unsql
```

### Prerequisite

This package, although not directly dependent, but requires ``mysql`` package installed from ``npm install mysql`` and the mysql connection pool to interact with the database.


## Import

Import by using any one of the following methods:

CommonJS import
```javascript
const UnSQL = require('unsql')
```

OR

ES6 import
```javascript
import UnSQL from 'unsql'
```

## Usage

UnSQL provides three methods viz. ``find``, ``save`` and ``del`` to perform the **CRUD** operations. 
These methods are designed to have a simple interface but are capable of generating any level of complex structured query.

Each of these three methods accept a plain javascript object (We call it the query object) 
with multiple parameters (optional) depending upon the function they are being passed in to.
 Some of the parameters also allow you to write multiple complete SQL as sub-query inside the value.

 To access these three methods, you require a separate **Model** file corresponding to each of your database tables.

 ## Model
 Below are the examples of how to create a Model file for functional and object oriented programing:

### Model Class: Object oriented programing (Recommended)
Here ``Product`` is the demo Model class. By extending the ``Product`` with the ``UnSQL`` class, ``Product`` gains access to all the built-in functionalities and methods required to interact with the database.

Product.class.js
```javascript
import UnSQL from 'unsql'
import pool from 'your-mysql-service'

class Product extends UnSQL {

    // Database table to map this model class (Mandatory) 
    static TABLE_NAME = 'replace_with_db_table_name'

    // MySQL connection pool (Mandatory)
    static POOL = pool

    // Declare database columns as class properties here (Optional)
    // Note: For "Auto Incrementing" column, use null or 0 as default value
    // firstColumnName // No default value provided
    // secondColumnName = 'Default Value'

    // Declare custom methods here (Optional)
    // Note: All methods must be declared as static
    // static test() {
        // // Code goes here
    // }
    
}

```

### Model file: Functional programing

Functional programing approach requires to override all the built-in methods provided by the UnSQL, along with the **TABLE_NAME**  and **POOL** parameters inside each overriding method.

Below is the example of creating the Model file for the same "Product" table as described above, but without any class declaration.

Product.js
```javascript
import UnSQL from 'unsql'
import pool from 'your-mysql-service'

const table = 'replace_with_db_table_name'

async function find({ select = '*', alias = null, join = null, where = null, whereOr = null, junction = 'AND', groupBy = null, having = null, orderBy = null, orderDirection = 'DESC', rowCount = null, offset = null }){
    UnSQL.TABLE_NAME = table
    UnSQL.POOL = pool
    return await UnSQL.find({ select, alias, join, where, whereOr, junction, groupBy, having, orderBy, orderDirection, rowCount, offset })
}

async function save(alias = null, where = null, whereOr = null, junction = 'AND'}){
    UnSQL.TABLE_NAME = table
    UnSQL.POOL = pool
    return await UnSQL.save({ data,updateObj, alias, where, whereOr, junction })
}

async function del( join = null, where = null, whereOr = null, junction = 'AND'}){
    UnSQL.TABLE_NAME = table
    UnSQL.POOL = pool
    return await UnSQL.del({ where, whereOr, junction })
}
```

Although functional approach is supported, but is not recommended.

All of the aforementioned methods return the result as a promise, 
which then resolves (or rejects) into a javascript object, 
and every such result object has an acknowledgement status named ``success``. 
It has a boolean value, which reflects the query being successful or failure.

Below is the example of the result object on failure:

```javascript
resultObject = {
    success: false,
    error: { 'Actual error object containing code, message and stack' }
}
```

Below are the explainations to each of these functions and all the parameters of the query object associated with them.

## find: Read / Retrieve

``find`` method is used for the read / retrieve operations of the data from the database. 
It takes in multiple (optional) parameters, in a plain javascript object format, and generates a structured sql from these parameters. 
For the sake of explanation, we will call this object as **findQuery**. 
Below is an example of this findQuery object with all the parameters and their corresponding default values.

```javascript
findQuery = {
    select: '*',
    alias: null,
    join: null,
    where: null,
    whereOr: null,
    junction: 'AND',
    groupBy: null,
    having: null,
    orderBy: null,
    orderDirection: 'DESC',
    rowCount: null,
    offset: null
}
```

Below is the example of the result **resolved** from the ``find`` method:

```javascript
resultObject = { 
    success: true,
    result: ['Array of results'] // Empty array [] if no results for matching conditions
}
```

### findQuery

Below are the explanations for each of the parameters of the findQuery object:

**select:** It takes in a string value, containing various column names as a comma separated values. 
Default value is ``'*'``. 
You may pass a full SQL as a sub-query inside this parameter to get value(s) from another table ``AS`` a field.

```javascript
select = 'columnOne, columnTwo, (SELECT anotherColumn FROM anotherTable WHERE conditions...) AS columnThree'
```

**alias:** This parameter takes in a string value that you want to use as an alias name for the table associated with the Model. 
Default value is ``null``. 
Passing this value enables you to use the same alias value as a prefix to all the associated columns, in all the other parameters. 
This parameter is extreamly important and handy for writing ``join`` queries.

```javascript 
alias = 't1'
 ```

**join:** This parameter takes in an array of objects. Each object represents a unique join condition, and **must** have these exact three properties ``type``, ``table`` and ``on``. Default value is ``null``.
    
- type: It defines the type of join query, can have any one of the values of "LEFT", "RIGHT", "INNER", "OUTER", "CROSS" etc. 
- table: Table name (along with its alias) with which the Model's table has to be joined
- on: Condition to map the join, as a string value

```javascript
condition1 = { type: 'LEFT', table: 'firstTable a', on: 't1.commonColumn = a.commonColumn' }

condition2 = { type: 'LEFT', table: 'secondTable b', on: 't1.commonColumn = b.commonColumn' }

join = [ condition1, condition2 ]
```

**where** & **whereOr:** Both of these parameters accept a two dimentional array i.e. an array of array. 
Each child array represents a unique ``WHERE`` condition. 
The only difference between the two parameters is the joining clause used by them. 
``where`` uses ``AND`` clause to join the conditions and ``whereOr`` uses ``OR`` as joining clause.
Default value for both the parameters is ``null``.
```javascript
condition1 = [ 'columnOne', '=', value1 ]

condition2 = [`(columnTwo = '${value2}' OR columnThree > ${value3}) AND (anotherCondition) OR (anotherCondition)...`]

condition3 = ['columnFour','IN',`(SELECT anotherColumn FROM anotherTable WHERE conditions...)`]

where = whereOr = [condition1, condition2, condition3]
```
Here, ``condition1`` represents typical condition array with three values: 
- columnName
- Equalities, "IN", "NOT IN", "IS", "IS NOT" etc.
- Value, "null", structured SQL

``condition2`` represents a more advanced level or pairing of multiple types of conditions inside a single array. This type of string can consist any number of conditions within, but with a limitation of being a single valued array. Notice we have not passed the second and third values here.

``condition3`` represents the example of using "IN" as a condition check and also shows passing a structured SQL as the value.

Please note: When working with ``alias`` and ``join`` same **alias prefix** have to be passed with the corresponding column names in these condition as well.

**junction:** This parameter accepts any one of the two string values ``AND``, ``OR``. Default value is ``AND``. It acts as the joining clause to connect the ``where`` and ``whereOr`` parameters.
It only comes into the picture if both ``where`` and ``whereOr`` are passed.

```javascript
[where_conditions] (junction- 'AND' / 'OR') [whereOr_conditions]
```

**groupBy:** This parameter accepts a column name as a string value and groups the result rows based on this column. Default value is ``null``. When using with ``alias`` and (or) ``join``, corresponding prefix must be used. 

```javascript
groupBy = 'columnName'
```

**having:** This parameter accepts a string value, containing a condition with aggregate function. Default value is ``null``. It is used in paired with the ``groupBy`` parameter. It is  extreamly useful because ``where`` and ``whereOr`` does not support the aggregate functions. When used with ``alias`` or ``join``, corresponding prefix must be used.

```javascript
having = 'COUNT(columnName) > someValue'
```

**orderBy:** This parameter accepts the column name as a string value. It is used to sort the result rows on the bases of this column. Default value is ``null``. When used with ``alias`` or ``join``, same prefix must be used.

```javascript
orderBy = 'columnName'
```

**orderDirection:** This parameter is used in pair with the ``orderBy`` parameter and accepts any one of the two values ``ASC`` or ``DESC``. It defines the order in which the sorting of the result rows must be done. Default value is ``DESC``.

```javascript
orderDirection = 'ASC'
```

**rowCount:** This parameter accepts an integer value and is used to set the maximum limit for the number of result rows that are required. Default value is ``null`` hence all the rows will be returned by default.

```javascript
rowCount = 20
```

**offset:** This parameter accepts an integer value, it determines the start index for the result rows. All the entries that are before this index are skipped. Default value is ``null``. This parameter paired with the ``rowCount`` parameter to to achieve server side pagination.

```javascript
offset = 2
```

## save: Insert / Update / Upsert

``save`` method is used for insert / update / upsert operations of data into the database. It takes in a plain javascript object with multiple parameters, ``data`` being the only mandatory / required parameter among these. 
For the sake of explainations, we will call this object as **saveQuery**.
Below is an example of this saveQuery object with all the parameters and their corresponding default values:

```javascript
saveQuery = {
    alias: null,
    data,
    updateObj: null,
    where: null,
    whereOr: null,
    junction: 'AND'
}
```

Depending upon the combinations of parameters passed, ``save`` method will automatically perform different type of operations.
Different combinations of parameters to achieve different operations are explained below:

**Insert:** When only ``data`` parameter is passed inside the saveQuery, the ``save`` method will generate ``insert`` sql.

```javascript
saveQuery = { data: dataToBeInserted }
```

**Update:** When ``where`` and (or) ``whereOr`` parameters are passed along with the ``data`` parameter inside the saveQuery, the ``save`` method will generate ``update`` sql and perform an update operation with corresponding conditions passed inside the ``where`` and (or) ``whereOr`` parameters.

Sample 1
```javascript
saveQuery = { 
    data: dataToBeUpdated,
    where: [conditions] 
    }
```

Sample 2
```javascript
saveQuery = { 
    data: dataToBeUpdated,
    whereOr: [conditions] 
    }
```
Sample 3
```javascript
saveQuery = { 
    data: dataToBeUpdated,
    where: [conditions1],
    whereOr: [conditions2],
    junction: 'OR'
    }
```

**Upsert:** When ``updateObj`` parameter is passed along with the ``data`` parameter inside the saveQuery, the ``save`` method will generate ``upsert`` sql and perform an upsert operation by updating the corresponding columns with thier values passed inside the ``updateObj`` parameter.

```javascript
saveQuery = {
    data: dataToBeInserted,
    updateObj: dataToBeUpdated
}
```

### saveQuery

Below are the explainations for ``data`` and ``updateObj`` parameters of the saveQuery object. 
Remaining parameters are exactly the same as explained above for the findQuery object.

**data:** This parameter accepts data in two forms:
- Javascript object for insert / update of single row
- Array or javascript objects for inserting multiple rows at once.

**updateObj:** This parameter is optional and is only used for **upsert** operations. This accepts data as javascript object, however, requires only that part of data that needs to be updated in case of "Duplicate Primary Key" is found in the ``data`` parameter.


Below is the example of the result resolved from an ``save`` method after **insert** operation:

```javascript
resultObject = {
    success: true,
    insertID: 'ID_of_newly_added_row'
}
```
For **update** and **upsert** operations this "insertID" field will return "0" as value.


## del: Delete / Remove

``del`` method is used to perform delete operation of data from the database. It accepts a plain javascript object with multiple parameters, 
for the sake of explaination, we will call this object as **delQuery**. 
It removes one or multiple rows at once depending upon the conditions passed inside the ``where`` and (or) ``whereOr`` parameters.

Below is the example for this saveQuery object with all the parameters and their corresponding default values:
```javascript
delQuery = {
    where: null,
    whereOr: null,
    junction: 'AND'
}
```
All the parameters passed here are already explained above, inside the findQuery object. Please read the above explanations for these parameters.

## Examples
For all the below examples we assume these samples are existing inside express app,
 ``Product`` is the **Model Class** imported into the same routes file, and all the above setup is complete. 
 "ID" here is the demo field that may represent your primary key or any identifier.
 Depending upon if result is resolved or rejected, **Products** variable will get the result object as mentioned above.


### Example 1: Read data from the database

```javascript
router.get('/products',async (req,res)=>{

    const select = 'ID, title, description'
    const Products = await Product.find({ select }).catch(err => err)

})

```

### Example 2: Read data from the database with where clause

```javascript
router.get('/products/:id',async (req,res)=>{

    const { id } = req.params
    const select = 'ID, title, description'
    const where = [['ID','=', id]]
    
    const Products = await Product.find({ select, where }).catch(err => err)

})

```

### Example 3: Insert data in the database

```javascript
router.post('/products',async (req,res)=>{

    const data = req.body

    const Products = await Product.save({ data }).catch(err => err)

})

```

### Example 4: Update data in the database

```javascript
router.put('/products/:id',async (req,res)=>{

    const { id } = req.params
    const data = req.body
    const where = [['ID','=', id]]

    const Products = await Product.save({ data, where }).catch(err => err)

})

```

### Example 5: Upsert data in the database

```javascript
router.post('/products',async (req,res)=>{

    const data = req.body
    const { ID, ...updateObj } = data

    const Products = await Product.save({ data, updateObj }).catch(err => err)

})

```

### Example 6: Delete data in the database

```javascript
router.delete('/products/:id',async (req,res)=>{

    const { id } = req.params
    const where = [['ID','=', id]]

    const Products = await Product.del({ where }).catch(err => err)

})

```

  
## Author

- [Siddharth Tiwari](https://www.designsencoded.com/)
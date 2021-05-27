# SchemaLess
It is a JavaScript library developed and maintained by Siddharth Tiwari.

SchemaLess is a repository based ORM, that facilitates to interact with the MySQL databases without actually writing a single line of SQL query.

This also eliminates the hectic of remembering and placing of SQL keywords in their specific order and lets the developers to focus on the intented task.

One of the many features is that it works without the requirement of any schema declaration so you don't have to update the schema if you made any changes to the actual database, the library will continue to work as intended.

Another greate feature is that it eliminates the issues relating to the handling of transactions and also takes care of the graceful termination of the MySQL connection after the operation is completed or with a transaction rollback and connection termination in case of any error.

It also converts the traditional callback based MySQL functions into the newer and advanced Promise based functions.

Please note: Current version is not ment for open public use, it is only ment to work with the Designs Encoded's custom architecture. Public version along with a proper wiki is under construction and will be available soon.

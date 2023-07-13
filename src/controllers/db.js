//require sequilize
const req = require('express/lib/request');
const Sequelize = require('sequelize');

//connect to mysql database, username, password, database name
const sequelize = new Sequelize('mysql://example:example@ip/dbname');

//initialize sequelize
sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
}).catch(err => {
    console.error('Unable to connect to the database:', err);
});



//initialize pastebin model, catch any errors
const Pastebin = sequelize.define('pastebin', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    uuid: {
        type: Sequelize.STRING,
        unique: true,
        length: 8
    },
    ipaddr: {
        type: Sequelize.STRING,
    },
    expires: {
        type: Sequelize.DATE,
    },
    title: {
        type: Sequelize.STRING
    },
    content: {
        type: Sequelize.STRING
    }
});







//create the table if it doesn't exist, log if it does
Pastebin.sync({ force: false }).then(() => {
    console.log('Pastebin table created successfully.');
}).catch(err => {
    console.error('Unable to create table:', err);
});




//export the connection
module.exports = {
    sequelize,
    Pastebin
};



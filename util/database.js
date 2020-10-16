const Sequelize = require('sequelize');

const sequelize = new Sequelize('node_complete', 'root', '9650276711_M', {
    dialect: 'mysql',
    host: 'localhost'
});

module.exports = sequelize;
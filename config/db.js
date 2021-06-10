const { Sequelize } = require('sequelize');
require('dotenv').config({ path: 'variables.env' });

const sequelize = new Sequelize(process.env.BD_NAME, process.env.BD_USER, process.env.BD_PASS, {
    host: process.env.BD_HOST,
    dialect: 'mysql',
    port: process.env.BD_PORT,
    operatorsAliases: false,
    define: {
        timestamps: false
    },
    pool: {
        max: 5,
        min: 0,
        acquier: 30000,
        idle: 10000
    }
});

module.exports = sequelize;
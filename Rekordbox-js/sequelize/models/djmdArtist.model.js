const { DataTypes } = require('sequelize');
const { Stats } = require('./stats.js');


module.exports = (sequelize) => {
    return sequelize.define('djmdArtist', {
        ID: {
            type: DataTypes.STRING(255),
            primaryKey: true
        },
        Name: {
            type: DataTypes.STRING(255),
            defaultValue: null
        },
        SearchStr: {
            type: DataTypes.STRING(255),
            defaultValue: null
        }
    }, {
        tableName: 'djmdArtist'
    });
}

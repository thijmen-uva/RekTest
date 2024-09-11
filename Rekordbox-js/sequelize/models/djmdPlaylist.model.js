const { DataTypes } = require('sequelize');
const { Stats } = require('./stats.js');


module.exports = (sequelize) => {
    return sequelize.define('djmdPlaylist', {
        ID: {
            type: DataTypes.STRING,
            primaryKey: true,
            comment: "The ID (primary key) of the table entry."
        },
        Seq: {
            type: DataTypes.INTEGER,
            defaultValue: null,
            comment: "The sequence of the playlist (for ordering)."
        },
        Name: {
            type: DataTypes.STRING,
            defaultValue: null,
            comment: "The name of the playlist."
        },
        ImagePath: {
            type: DataTypes.STRING,
            defaultValue: null,
            comment: "The path to the image of the playlist."
        },
        Attribute: {
            type: DataTypes.INTEGER,
            defaultValue: null,
            comment: "The attribute of the playlist."
        },
        ParentID: {
            type: DataTypes.STRING,
            defaultValue: null,
            references: {
                model: 'djmdPlaylist',
                key: 'ID'
            },
            comment: "The ID of the parent playlist (:class:`DjmdPlaylist`)."
        },
        SmartList: {
            type: DataTypes.TEXT,
            defaultValue: null,
            comment: "The smart list settings of the playlist."
        }
    });
}

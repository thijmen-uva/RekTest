const { DataTypes } = require('sequelize');
const { Stats } = require('./stats.js');


module.exports = (sequelize) => {
    return sequelize.define('djmdSongPlaylist', {
                ID: {
                        type: DataTypes.STRING(255),
                        primaryKey: true,
                    },
                    PlaylistID: {
                        type: DataTypes.STRING(255),
                        allowNull: true,
                        defaultValue: null,
                    },
                    ContentID: {
                        type: DataTypes.STRING(255),
                        allowNull: true,
                        defaultValue: null,
                    },
                    TrackNo: {
                        type: DataTypes.INTEGER,
                        allowNull: true,
                        defaultValue: null,
                    },
                
                    ...Stats,
        })
}

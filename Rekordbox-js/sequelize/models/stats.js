const { DataTypes } = require('sequelize');

const Stats = {
        UUID: {
            type: DataTypes.STRING(255),
            allowNull: true,
            defaultValue: null,
        },
        rb_data_status: {
    
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        rb_local_data_status: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        rb_local_deleted: {
            type: DataTypes.SMALLINT,
            allowNull: false,
            defaultValue: 0,
        },
        rb_local_synced: {
            type: DataTypes.SMALLINT,
            allowNull: false,
            defaultValue: 0,
        },
        usn: {
            type: DataTypes.BIGINT,
            allowNull: true,
            defaultValue: null,
        },
        rb_local_usn: {
            type: DataTypes.BIGINT,
            allowNull: true,
            defaultValue: null,
        },
    };

    module.exports = Stats;
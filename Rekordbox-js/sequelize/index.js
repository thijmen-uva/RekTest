const { Sequelize } = require('sequelize');
const { Setup } = require('./setup');
const sqlite3 = require('@journeyapps/sqlcipher').verbose();
const os = require('os');
const path = require('path');

const appDataPath = path.join(os.homedir(), 'AppData', 'Roaming', 'Pioneer', 'rekordbox', 'master.db');

const sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: appDataPath,
        dialectModule: sqlite3,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000, 
            idle: 10000, 
          },
        define: {
            freezeTableName: true,
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        }
    });
    
sequelize.query('PRAGMA cipher_compatibility = 4');
sequelize.query(`PRAGMA key = '${process.env.DATABASE_KEY}'`, { logging: false });


const modelDefiners = [
        require('./models/djmdContent.model'),
        require('./models/djmdSongPlaylist.model'),
        require('./models/djmdPlaylist.model'),
        require('./models/djmdArtist.model'),
        // Add more models here...
];

for (const modelDefiner of modelDefiners) {
	modelDefiner(sequelize);
}

Setup(sequelize);

module.exports = sequelize;
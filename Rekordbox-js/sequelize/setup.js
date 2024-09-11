function Setup(sequelize) {
    const { djmdContent, djmdSongPlaylist, djmdPlaylist, djmdArtist} = sequelize.models;

    djmdPlaylist.hasMany(djmdSongPlaylist, {
        foreignKey: 'PlaylistID',
        as: 'Songs',
        onDelete: 'CASCADE'
    });

    djmdSongPlaylist.belongsTo(djmdPlaylist, {
        foreignKey: 'PlaylistID',
        as: 'Playlist'
    });

    djmdSongPlaylist.belongsTo(djmdContent, { 
        foreignKey: 'ContentID',
        as: 'Content'
    });

    djmdPlaylist.hasMany(djmdPlaylist, {
        foreignKey: 'ParentID',
        as: 'Children',
        onDelete: 'CASCADE'
    });

    djmdPlaylist.belongsTo(djmdPlaylist, {
        foreignKey: 'ParentID',
        as: 'Parent'
    });

    djmdContent.belongsTo(djmdArtist, {
        foreignKey: 'ArtistID',
        as: 'Artist'
    });

    djmdArtist.hasMany(djmdContent, {
        foreignKey: 'ArtistID',
        as: 'Content',
    });
}

module.exports = { Setup };
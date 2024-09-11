const { v4: uuidv4 } = require('uuid');
const sequelize = require('./sequelize');
const { Op } = require('sequelize');
const { get } = require('request');

const { djmdSongPlaylist, djmdContent, djmdPlaylist, djmdArtist } = sequelize.models;

async function assertDatabaseConnectionOk() {
    console.log(`Checking database connection...`);
    try {
        await sequelize.authenticate();
        console.log('Database connection OK!');
    } catch (error) {
        console.log('Unable to connect to the database:');
        console.log(error.message);
        process.exit(1);
    }
}

async function getAllPlaylists() {
    return await djmdPlaylist.findAll({ logging: false });
}

async function getPlaylistById(id) {
    return await djmdPlaylist.findOne({ where: { ID: id }, logging: false });
}

async function findPlaylistByName(name) {
    return await djmdPlaylist.findOne({ where: { Name: name }, logging: false });
}

async function getPlaylistItems(playlistID) {
    return await djmdSongPlaylist.findAll({
        where: { PlaylistID: playlistID },
        include: [{ model: djmdContent, as: 'Content', include: [{ model: djmdArtist, as: 'Artist' }] }],
        logging: false
    });
}

async function getArtistName(artistID) {
    const artist = await djmdArtist.findOne({ where: { ID: artistID }, logging: false });
    return artist ? artist.Name : null;
}

async function getAllSongs() {
    return await djmdContent.findAll({ include: [{ model: djmdArtist, as: 'Artist' }], logging : false });
}

async function findSongByTitle(title) {
    return await djmdContent.findOne({ where: { Title: title }, logging: false });
}

async function getSongById(id) {
    return await djmdContent.findOne({
        where: { ID: id },
        include: [{ model: djmdArtist, as: 'Artist' }],
        logging: false
    });
}

async function searchContents(title = '', artist = '') {
    // console.log(`Searching for song with title: ${title} and artist: ${artist}`);
    const titlePattern = title.replace(/[-()]/g, '.').toLowerCase(); // Replace '-' and '()' with '.' to match any character
    const artistPattern = artist.replace(/[-()]/g, '.').toLowerCase(); // Replace '-' and '()' with '.' to match any character
    const result_title_query = await djmdContent.findOne({
        where: {
            [Op.and]: [
                sequelize.where(
                    sequelize.fn(
                        'LOWER',
                        sequelize.fn(
                            'REPLACE',
                            sequelize.fn(
                                'REPLACE',
                                sequelize.fn('TRIM', sequelize.col('Title')),
                                '(',
                                ''
                            ),
                            ')',
                            ''
                        )
                    ),
                    {
                        [Op.like]: `%${titlePattern}%`
                    }
                ),
                {
                    '$Artist.Name$': { [Op.like]: `%${artist}%` }
                }
            ]
        },
        include: [{ model: djmdArtist, as: 'Artist' }],
        logging: false
    });
    return result_title_query;
}

async function addToPlaylist(playlistID, contentID, trackNo = null) {
    const songExists = await getSongById(contentID);
    const playlistExists = await getPlaylistById(playlistID);
    if (!songExists || !playlistExists) {
        throw new Error('Song or playlist does not exist');
    }
    console.log(`Inserting song ${songExists.Title} into playlist ${playlistExists.Name}`);

    const playlistItems = await getPlaylistItems(playlistID);
    const insertIndex = trackNo ? trackNo : playlistItems.length + 1;
    const id = uuidv4().toString();
    const uuid = uuidv4().toString();
    return await djmdSongPlaylist.create({ ID: id, PlaylistID: playlistID, ContentID: contentID, TrackNo: insertIndex, UUID: uuid });
}

async function getAllTables() {
    return await sequelize.query("SELECT name FROM sqlite_master WHERE type='table';");
}

async function test() {
    try {

        // console.log(result_title_query.map(t => t.toJSON()));
        // await addToPlaylist('3183798534', '184292615');
        // const test = await Promise.all(tracks.map(async t => ({ Title: t.Title, Artist: await getArtistName(t.ArtistID) })));
        // console.log(test);
        // const test = await getAllSongs();
        // console.log(test[0]);
        // // console.log(enumerate(list));
        // console.log(await searchContents('Test'));

        // console.log(await getPlaylistItems(3183798534));
        // console.log(await getAllSongs());
    } catch (error) {
        console.error('Error during test execution:', error);
    } 
}

async function main() {
    await assertDatabaseConnectionOk();
    await test();
}

main().catch(error => {
    console.error('Error in main execution:', error);
});

module.exports = {
    assertDatabaseConnectionOk,
    getAllPlaylists,
    getPlaylistById,
    findPlaylistByName,
    getPlaylistItems,
    getAllSongs,
    findSongByTitle,
    getSongById,
    searchContents,
    addToPlaylist,
    getAllTables,
    getArtistName,
    addToPlaylist,
};

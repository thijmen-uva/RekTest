const { DataTypes } = require('sequelize');
const { Stats } = require('./stats.js');


module.exports = (sequelize) => {
    return sequelize.define('djmdContent', { 
                ID: {
                        type: DataTypes.STRING(255),
                        primaryKey: true,
                    },
                    FolderPath: {
                        type: DataTypes.STRING(255),
                        allowNull: true,
                        defaultValue: null,
                    },
                    FileNameL: {
                        type: DataTypes.STRING(255),
                        allowNull: true,
                        defaultValue: null,
                    },
                    FileNameS: {
                        type: DataTypes.STRING(255),
                        allowNull: true,
                        defaultValue: null,
                    },
                    Title: {
                        type: DataTypes.STRING(255),
                        allowNull: true,
                        defaultValue: null,
                    },
                    ArtistID: {
                        type: DataTypes.STRING(255),
                        allowNull: true,
                        defaultValue: null,
                    },
                    AlbumID: {
                        type: DataTypes.STRING(255),
                        allowNull: true,
                        defaultValue: null,
                    },
                    GenreID: {
                        type: DataTypes.STRING(255),
                        allowNull: true,
                        defaultValue: null,
                    },
                    BPM: {
                        type: DataTypes.INTEGER,
                        allowNull: true,
                        defaultValue: null,
                    },
                    Length: {
                        type: DataTypes.INTEGER,
                        allowNull: true,
                        defaultValue: null,
                    },
                    TrackNo: {
                        type: DataTypes.INTEGER,
                        allowNull: true,
                        defaultValue: null,
                    },
                    BitRate: {
                        type: DataTypes.INTEGER,
                        allowNull: true,
                        defaultValue: null,
                    },
                    BitDepth: {
                        type: DataTypes.INTEGER,
                        allowNull: true,
                        defaultValue: null,
                    },
                    Commnt: {
                        type: DataTypes.TEXT,
                        allowNull: true,
                        defaultValue: null,
                    },
                    FileType: {
                        type: DataTypes.INTEGER,
                        allowNull: true,
                        defaultValue: null,
                    },
                    Rating: {
                        type: DataTypes.INTEGER,
                        allowNull: true,
                        defaultValue: null,
                    },
                    ReleaseYear: {
                        type: DataTypes.INTEGER,
                        allowNull: true,
                        defaultValue: null,
                    },
                    RemixerID: {
                        type: DataTypes.STRING(255),
                        allowNull: true,
                        defaultValue: null,
                    },
                    LabelID: {
                        type: DataTypes.STRING(255),
                        allowNull: true,
                        defaultValue: null,
                    },
                    OrgArtistID: {
                        type: DataTypes.STRING(255),
                        allowNull: true,
                        defaultValue: null,
                    },
                    KeyID: {
                        type: DataTypes.STRING(255),
                        allowNull: true,
                        defaultValue: null,
                    },
                    StockDate: {
                        type: DataTypes.STRING(255),
                        allowNull: true,
                        defaultValue: null,
                    },
                    ColorID: {
                        type: DataTypes.STRING(255),
                        allowNull: true,
                        defaultValue: null,
                    },
                    DJPlayCount: {
                        type: DataTypes.STRING(255),
                        allowNull: true,
                        defaultValue: null,
                    },
                    ImagePath: {
                        type: DataTypes.STRING(255),
                        allowNull: true,
                        defaultValue: null,
                    },
                    MasterDBID: {
                        type: DataTypes.STRING(255),
                        allowNull: true,
                        defaultValue: null,
                    },
                    MasterSongID: {
                        type: DataTypes.STRING(255),
                        allowNull: true,
                        defaultValue: null,
                    },
                    AnalysisDataPath: {
                        type: DataTypes.STRING(255),
                        allowNull: true,
                        defaultValue: null,
                    },
                    SearchStr: {
                        type: DataTypes.STRING(255),
                        allowNull: true,
                        defaultValue: null,
                    },
                    FileSize: {
                        type: DataTypes.INTEGER,
                        allowNull: true,
                        defaultValue: null,
                    },
                    DiscNo: {
                        type: DataTypes.INTEGER,
                        allowNull: true,
                        defaultValue: null,
                    },
                    ComposerID: {
                        type: DataTypes.STRING(255),
                        allowNull: true,
                        defaultValue: null,
                    },
                    Subtitle: {
                        type: DataTypes.STRING(255),
                        allowNull: true,
                        defaultValue: null,
                    },
                    SampleRate: {
                        type: DataTypes.INTEGER,
                        allowNull: true,
                        defaultValue: null,
                    },
                    DisableQuantize: {
                        type: DataTypes.INTEGER,
                        allowNull: true,
                        defaultValue: null,
                    },
                    Analysed: {
                        type: DataTypes.INTEGER,
                        allowNull: true,
                        defaultValue: null,
                    },
                    ReleaseDate: {
                        type: DataTypes.STRING(255),
                        allowNull: true,
                        defaultValue: null,
                    },
                    DateCreated: {
                        type: DataTypes.STRING(255),
                        allowNull: true,
                        defaultValue: null,
                    },
                    ContentLink: {
                        type: DataTypes.INTEGER,
                        allowNull: true,
                        defaultValue: null,
                    },
                    Tag: {
                        type: DataTypes.STRING(255),
                        allowNull: true,
                        defaultValue: null,
                    },
                    ModifiedByRBM: {
                        type: DataTypes.STRING(255),
                        allowNull: true,
                        defaultValue: null,
                    },
                    HotCueAutoLoad: {
                        type: DataTypes.STRING(255),
                        allowNull: true,
                        defaultValue: null,
                    },
                    DeliveryControl: {
                        type: DataTypes.STRING(255),
                        allowNull: true,
                        defaultValue: null,
                    },
                    DeliveryComment: {
                        type: DataTypes.STRING(255),
                        allowNull: true,
                        defaultValue: null,
                    },
                    CueUpdated: {
                        type: DataTypes.STRING(255),
                        allowNull: true,
                        defaultValue: null,
                    },
                    AnalysisUpdated: {
                        type: DataTypes.STRING(255),
                        allowNull: true,
                        defaultValue: null,
                    },
                    TrackInfoUpdated: {
                        type: DataTypes.STRING(255),
                        allowNull: true,
                        defaultValue: null,
                    },
                    Lyricist: {
                        type: DataTypes.STRING(255),
                        allowNull: true,
                        defaultValue: null,
                    },
                    ISRC: {
                        type: DataTypes.STRING(255),
                        allowNull: true,
                        defaultValue: null,
                    },
                    SamplerTrackInfo: {
                        type: DataTypes.INTEGER,
                        allowNull: true,
                        defaultValue: null,
                    },
                    SamplerPlayOffset: {
                        type: DataTypes.INTEGER,
                        allowNull: true,
                        defaultValue: null,
                    },
                    SamplerGain: {
                        type: DataTypes.FLOAT,
                        allowNull: true,
                        defaultValue: null,
                    },
                    VideoAssociate: {
                        type: DataTypes.STRING(255),
                        allowNull: true,
                        defaultValue: null,
                    },
                    LyricStatus: {
                        type: DataTypes.INTEGER,
                        allowNull: true,
                        defaultValue: null,
                    },
                    ServiceID: {
                        type: DataTypes.INTEGER,
                        allowNull: true,
                        defaultValue: null,
                    },
                    OrgFolderPath: {
                        type: DataTypes.STRING(255),
                        allowNull: true,
                        defaultValue: null,
                    },
                    Reserved1: {
                        type: DataTypes.TEXT,
                        allowNull: true,
                        defaultValue: null,
                    },
                    Reserved2: {
                        type: DataTypes.TEXT,
                        allowNull: true,
                        defaultValue: null,
                    },
                    Reserved3: {
                        type: DataTypes.TEXT,
                        allowNull: true,
                        defaultValue: null,
                    },
                    Reserved4: {
                        type: DataTypes.TEXT,
                        allowNull: true,
                        defaultValue: null,
                    },
                    ExtInfo: {
                        type: DataTypes.TEXT,
                        allowNull: true,
                        defaultValue: null,
                    },
                    rb_file_id: {
                        type: DataTypes.STRING(255),
                        allowNull: true,
                        defaultValue: null,
                    },
                    DeviceID: {
                        type: DataTypes.STRING(255),
                        allowNull: true,
                        defaultValue: null,
                    },
                    rb_LocalFolderPath: {
                        type: DataTypes.STRING(255),
                        allowNull: true,
                        defaultValue: null,
                    },
                    SrcID: {
                        type: DataTypes.STRING(255),
                        allowNull: true,
                        defaultValue: null,
                    },
                    SrcTitle: {
                        type: DataTypes.STRING(255),
                        allowNull: true,
                        defaultValue: null,
                    },
                    SrcArtistName: {
                        type: DataTypes.STRING(255),
                        allowNull: true,
                        defaultValue: null,
                    },
                    SrcAlbumName: {
                        type: DataTypes.STRING(255),
                        allowNull: true,
                        defaultValue: null,
                    },
                    SrcLength: {
                        type: DataTypes.INTEGER,
                        allowNull: true,
                        defaultValue: null,
                    },
                
                    ...Stats,
        })
}

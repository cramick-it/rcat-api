const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { Types } = Schema;
const idvalidator = require('mongoose-id-validator');

const songSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    song_file_url: {
        type: String,
        required: true
    },
    genres: [
        {
            type: Types.ObjectId,
            ref: 'Genre'
        }
    ],
    main_artist_name: {
        type: String,
        required: true
    },
    artists: {
        type: [String],
        required: true,
        trim: true,
    },
    album_art_image_url: {
        type: String
    },
    song_writers: [
        {
            name: {
                type: String,
                required: true
            },
            percentage_100_total_song: {
                type: Number,
                required: true
            },
            percentage_100_publisher: {
                type: Number,
                required: true
            },
            publisher: {
                type: String,
                required: true
            },
            rev_wallet_address: {
                type: String,
                required: true
            },
            rev_email: {
                type: String,
                required: true
            },
            publisher_rights_organization: {
                type: String
            },
            iswc: {
                type: String
            }
        }
    ],
    sound_owners: [
        {
            name: {
                type: String,
                required: true
            },
            role: {
                type: String,
                required: true
            },
            percentage_100: {
                type: Number,
                required: true
            },
            rev_wallet_address: {
                type: String,
                required: true
            },
            rev_email: {
                type: String,
                required: true
            },
            isrc: {
                type: String
            }
        }
    ],
    collaborators: [
        {
            name: {
                type: String,
                required: true
            },
            role: {
                type: String,
                required: true
            },
            percentage_100: {
                type: Number,
                required: true
            },
            rev_wallet_address: {
                type: String,
                required: true
            },
            rev_email: {
                type: String,
                required: true
            },
            isrc: {
                type: String
            }
        }
    ],
    status: {
        type: String
    }
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    },
});
// Required to include to avoid error: Schema hasn't been registered for model \"SongWriter\".\nUse mongoose.model(name, schema)
require('./genre');
songSchema.plugin(idvalidator);

songSchema.statics.createSong = async (data) => {
    const searchQuery = {title: data.title};
    return await Song.create(searchQuery, data, {new: true, upsert: true});
};


// Pre hook for `findOneAndUpdate`
songSchema.pre('findOneAndUpdate', function(next) {
    this.options.runValidators = true;
    next();
});

const Song = mongoose.model('Song', songSchema);
module.exports = Song;
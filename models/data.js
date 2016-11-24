let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let userSchema = new Schema(
    {
        username: {
            type: String, required: true, unique:true
        },
        password: {
            type: String, required: true
        },
        birthday: {
            type: Date, required: true
        },
        name: {
            type: String, required: true
        },
        gender: {
            type: String, required: true
        },
        email: {
            type: String, required: true
        },
        notification: {
            type: Boolean, required: true
        },
        comments: {
            type: Array, required: true, default: []
        },
        events: {
            type: Array, required: true, default: []
        },
        following: {
            type: Array, required: true, default: []
        },
        followedBy: {
            type: Array, required: true, default: []
        },
        adminPrivilege: {
            type: Boolean, required: true, default: false
        }
    },
    {
        collection: 'users'
    }
);

let eventSchema = new Schema(
    {
        id: {
            type: Schema.Types.ObjectId, required: true, unique: true
        },
        title: {
            type: String, required:true
        },
        time: {
            type: Date, required: true
        },
        owner: {
            type: Schema.Types.Mixed
        },
        type: {
            type: String, required: true
        },
        private: {
            type: Boolean, required: true
        },
        notification: {
            type: Boolean, required: true, default: false
        },
        value: {
            type: Number, required: true, default: 0
        },
        share: {
            type: Number, required: true, default: 0
        }
    },
    {
        collection: 'events'
    }
);

let commentSchema = new Schema(
    {
        id: {
            type: Schema.Types.ObjectId, required: true, unique: true
        },
        content: {
            type: String, required: true
        },
        username: {
            type: String, required: true
        },
        timestamp: {
            type: Date, required: true, default: Date.now
        }
    },
    {
        collection: 'comments'
    }
);

mongoose.connect('mongodb://localhost/usersdb');
module.exports = mongoose.model('User', userSchema);
module.exports = mongoose.model('Event', eventSchema);
module.exports = mongoose.model('Comment', commentSchema);

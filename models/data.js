var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var userSchema = new Schema(
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
        }
        notification: {
            type: Boolean, required: true
        },
        comments: {
            type: Array, required: true, default: []
        }
        events: {
            type: Array, required: true, default: []
        }
    },
    {
        collection: 'users'
    }
);

var eventSchema = new Schema(
    {
        id: {
            type: ObjectId, required: true, unique: true
        },
        title: {
            type: String, required:true
        },
        time: {
            type: Date, required: true
        },
        owner: {
            type: Mixed
        },
        type: {
            type: String, required: true
        },
        privacy: {
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

var commentSchema = new Schema(
    {
        id: {
            type: ObjectId, required: true, unique: true
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
        collection: comments
    }
);

mongoose.connect('mongodb://localhost/usersdb');
module.exports = mongoose.model('User', userSchema);
module.exports = mongoose.model('Event', eventSchema);
module.exports = mongoose.model('Comment', commentSchema);

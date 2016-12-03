let mongoose = require('mongoose');
let passportLocalMongoose = require('passport-local-mongoose');

let Schema = mongoose.Schema;

let commentSchema = new Schema(
    {
        // id: {
        //     type: Schema.Types.ObjectId, required: true, unique: true
        // },
        content: {
            type: String, required: true
        },
        owner: {
            type: String, required: true
        },
        event: {
            type: String
        }
        // timestamp: {
        //     type: Date, required: true, default: Date.now
        // }
    },
    {
        collection: 'comments'
    }
);

let eventSchema = new Schema(
    {
        // _id: {
        //     type: Schema.Types.ObjectId, required: true, unique: true
        // },
        title: {
            type: String, required:true
        },
        time: {
            type: Date, required: true
        },
        owner: {
            type: String
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
        },
        liked: {
            type:[String], default:[]
        },
        comments: {
            type:[Schema.Types.ObjectId], default:[]
        }
    },
    {
        collection: 'events'
    }
);

let userSchema = new Schema(
    {
        username: {
            type: String, required: true, unique:true
        },
        // password: {
        //     type: String, required: true
        //},
        birthday: {
            type: String, required: true
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
            type: [Schema.Types.ObjectId],default: []
        },
        events: {
            type: [Schema.Types.ObjectId],default: []
        },
        following: {
            type: [String], default: []
        },
        followedBy: {
            type: [String] ,default: []
        },
        adminPrivilege: {
            type: Boolean, required: true, default: false
        },
        color: {
            type: String, default: "#FFFFFF"
        }
    },
    {
        collection: 'users'
    }
);

userSchema.plugin(passportLocalMongoose, {usernameField: 'email'});

<<<<<<< HEAD
mongoose.connect('mongodb://doo:universityoftoronto@ds115798.mlab.com:15798/doo');

=======
// mongoose.connect('mongodb://localhost/usersdb');
mongoose.connect('mongodb://doo:universityoftoronto@ds115798.mlab.com:15798/doo');
>>>>>>> CSC309-Fall-2016/master
let schema = {'User': mongoose.model('User', userSchema), 'Event': mongoose.model('Event', eventSchema),
              'Comment': mongoose.model('Comment', commentSchema)
};
module.exports = schema;

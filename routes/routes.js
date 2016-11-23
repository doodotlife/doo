let db = require('../models/data');


module.exports = {
    /**User Interactions**/
    signUp: function (req, res) {
    // With email, username and password (encrypted, decrypt here and save to db)
        //TODO: Deal with encryption/decryption, replace 'success' with standarized responses

        let newUser = new db.User(req.body);
        newUser.save(function(err) {
            if (err) {
                for (let field in err.errors) {
                    console.log(field);
                }
            }

            res.send('Success');
    })


},
    deleteAccount: function () {
    // User voluntarily delete his/her own account, need to wipe out everything about him/her
    // from database
},

    logIn: function (req, res) {

    // email/username and password (encrypted, decrypt here and check with db)
    // TODO: Replace response msg with standarized responses
    db.User.findOne({username: req.body.username}, function (err, user) {
        if (err) throw err;

        if(user.password==req.body.password){
            res.send('Success');
        }else{
            res.send('Login failed');
        }

    })

},

    logOut: function (req, res) {
    // clear session, return to main page
        req.session.destroy();
        res.redirect('/');
},


    addEvent: function () {
    // With dates, event name, event type
},

    deleteEvent: function () {
    // With dates, event name, event type
},

    editEvent: function () {
    // With dates, event name, event type
},

    editProfile: function () {
    // save the updates to db
},

    follow: function () {
    // add the person to current user's 'following' property
    // add the current user to the person's 'followedBy' property
},

    unFollow: function () {
    // remove this person from current user's 'following' property
    // remove the current user from the person's 'followedBy' property
},

    showFollowedEvents: function () {
    // get followed people from 'following' property
    // return their events
},

    showMyEvents: function () {
    // get the current user's events
},

    plusOne:function () {
    // pass in event id, change +1 value
},

    addTheDDLToMyList:function () {
    // add someone's deadline event to the current user's own list
},

    comment: function (){
    // current user leave a comment to someone's event, put this commentId into this event
},

    deleteComment: function () {
    // delete one's own comment, delete the corresponding comment in this event
},

    subscribeEmailNotificatino: function () {
    // future feature
},

    search: function () {
    // search by username/date/keyword/category
    // How to know if the input is a username or a date or a keyword or a category?
},

/**Functions for Admin users**/
    deleteUsers:function () {
    // delete the selected users from database
},

    deleteEvents: function () {
    // delete events from database
},

    deleteInproperComments: function () {
    // delete whatever comments the admin doesn't like
},

    createCommonEvents: function () {
    // create some sample/common events for the users to add in one click
}


};


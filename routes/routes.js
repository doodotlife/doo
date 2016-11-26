let db = require('../models/data');



module.exports = {
    /**User Interactions**/
    signUp: function(req, res) {
        // With email, username and password (encrypted, decrypt here and save to db)
        //TODO: Deal with encryption/decryption, replace 'success' with standarized responses

        let newUser = new db.User(req.body);
        db.User.findOne({
            username: newUser.username
        }, function(err, result) {
            if (err) {
                for (let field in err.errors) {
                    console.log(field);
                }
            }
            if (!result) {
                newUser.save(function() {
                    res.send('Success');
                })
            } else {
                res.send('User already exist');
            }
        });



    },
    //req.body
    // {
    //     "username":username;
    //     "password":password;
    // }
    deleteAccount: function(req, res) {
        // User voluntarily delete his/her own account, need to wipe out everything about him/her
        // from database
        db.User.findOne({
            "_id": req.body.username
        }, function(err, user) {
            console.log(user);
            if (user.password == req.body.password) {
                for (let i = 0; i < user.events.length; i++) {
                    deleteEventHelper(user.events[i]);
                }
                user.remove(function(err) {
                    if (err) {
                        return res.send(500, {
                            error: err
                        });
                    }
                    res.send("Success");
                });
            } else {
                res.send("incorrect password");
            }
        })
    },

    logIn: function(req, res) {
        console.log(req.body);
        // email/username and password (encrypted, decrypt here and check with db)
        // TODO: Replace response msg with standarized responses
        db.User.findOne({
            username: req.body.username
        }, function(err, user) {
            console.log(user);
            if (err) throw err;
            //we cannot compare password directly
            //because it might be null
            //in case that there doesn't exist such user
            if (user) {
                if (user.password == req.body.password) {
                    req.session.user_id = user._id;
                    req.session.username = user.username;
                    req.session.is_admin = user._doc.adminPrivilege;
                    res.send("success");
                } else {
                    res.send('Login failed');
                }
            } else {
                res.send('Login failed');
            }

        })

    },

    logOut: function(req, res) {
        // clear session, return to main page
        req.session.destroy();
        res.redirect('/');
    },

    /* req.body format
        {
            "user": id,
            "event": {
                title,
                time,
                type，
                private
            }
        } */
    addEvent: function(req, res) {
        // With dates, event name, event type

        let newEvent = new db.Event(req.body.event);

        newEvent.save(function(err, newEvent) {
            if (err) throw err;
            // add event id to user
            db.User.findOneAndUpdate({
                    "_id": req.body.user
                }, {
                    $push: {
                        "events": newEvent.id
                    }
                },
                function(err, user) {
                    if (err) return res.send(500, {
                        error: err
                    });
                    newEvent.owner.push(req.body.user);
                    newEvent.save();
                    return res.send("Success");
                });
        });
    },

    /* req.body format
    {
        "user": id,
        "event": id
    } */
    deleteEvent: function(req, res) {
        // With dates, event name, event type
        db.Event.findOne({
            "_id": req.body.event
        }, function(err, eventObj) {
            console.log(eventObj);
            for (let i = 0; i < eventObj.owner.length; i++) {
                db.User.findOneAndUpdate({
                        "_id": eventObj.owner[i]
                    }, {
                        $pull: {
                            "events": eventObj.id
                        }
                    },
                    function(err, user) {
                        if (err) return res.send(500, {
                            error: err
                        });
                    });
            }
            eventObj.remove(function(err) {
                if (err) throw err;

                res.send("Success");
            })
        });


    },

    editEvent: function() {
        // With dates, event name, event type
    },

    // req.body format:
    // {
    //     "user":id;
    //     "profile":{
    //         "password":password;
    //         "name":name;
    //         "birthday":birthday;
    //         "gender":gender;
    //         "notification":true or false;
    //     }
    // }
    editProfile: function(req, res) {
        db.User.findOneAndUpdate({
            "_id": req.body.user
        }, {
            $set: req.body.profile
        }, function(err, user) {
            if (err) {
                return res.send(500, {
                    error: err
                });
            }
            //save error handler
            user.save();
            res.send("Success");
        });
    },

    // req.body:
    //     {
    //         "user":id;
    //         "following":id
    //     }
    follow: function(req, res) {
        // add the person to current user's 'following' property
        // add the current user to the person's 'followedBy' property
        //TODO:handle duplicate follower
        db.User.findOneAndUpdate({
            "_id": req.body.user
        }, {
            $push: {
                "following": req.body.following
            }
        }, function(err, user) {
            if (err) {
                return res.send(500, {
                    error: err
                });
            }
        })
        db.User.findOneAndUpdate({
            "_id": req.body.following
        }, {
            $push: {
                "followedBy": req.body.user
            }
        }, function(err, user) {
            if (err) {
                return res.send(500, {
                    error: err
                });
            }
        })
        res.send("Success");

    },

    unFollow: function() {
        // remove this person from current user's 'following' property
        // remove the current user from the person's 'followedBy' property
    },

    showFollowedEvents: function() {
        // get followed people from 'following' property
        // return their events
    },

    getEvents: function() {
        // get the current user's events
    },

    plusOne: function() {
        // pass in event id, change +1 value
    },

    addTheDDLToMyList: function() {
        // add someone's deadline event to the current user's own list
    },

    /* req.body format
     * {
     *   "eventID": id,
     *   "comment": {
     *     content,
     *     username, (The one who make the comment)
     *     timestamp
     *   }
     * }
     */

    comment: function(req, res) {
        // current user leave a comment to someone's event, put this commentId into this event
        let newComment = new db.Comment(req.body.comment);

        newComment.save(function(err, newComment) {
            if (err) throw err;
            // add comment to event
            db.Event.findOneAndUpdate({
                "_id": req.body.eventID
            }, {
                $push: {
                    "comments": newComment.id
                }
            }, function(err, event) {
                newComment.save();
                return res.send("Success");
            });
        });
    },
    /* req.body format
     * {
     *   "comment": id,
     *   "event": id
     * }
     */
    deleteComment: function(req, res) {
        // delete one's own comment, delete the corresponding comment in this event
        db.Comment.findOne({
            "_id": req.body.comment
        }, function(err, commentObj) {
            db.Event.findOneAndUpdate({
                "_id": req.body.event
            }, {
                $pull: {
                    "comments": commentObj.id
                }
            }, function(err, user) {
                if (err) return res.send(500, {
                    error: err
                });
            });
            commentObj.remove(function(err) {
                if (err) throw err;
                res.send("Success");
            });
        });
    },

    subscribeEmailNotificatino: function() {
        // future feature
    },

    search: function() {
        // search by username/date/keyword/category
        // How to know if the input is a username or a date or a keyword or a category?
    },

    /**Functions for Admin users**/
    deleteUsers: function() {
        // delete the selected users from database
    },

    deleteEvents: function() {
        // delete events from database
    },

    /* req.body format
     * {
     *   "comment": id,
     *   "event": id
     * }
     */
    deleteInproperComments: function(req, res) {
        // delete whatever comments the admin doesn't like
        db.Comment.findOne({
            "_id": req.body.comment
        }, function(err, commentObj) {
            db.Event.findOneAndUpdate({
                "_id": req.body.event
            }, {
                $pull: {
                    "comments": commentObj.id
                }
            }, function(err, user) {
                if (err) return res.send(500, {
                    error: err
                });
            });
            commentObj.remove(function(err) {
                if (err) throw err;
                res.send("Success");
            });
        });
    },

    createCommonEvents: function() {
        // create some sample/common events for the users to add in one click
    }


};

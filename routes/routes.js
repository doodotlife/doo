let db = require('../models/data');

let helper = {

    deleteEventHelper: function(id) {
        db.Event.findOne({
                "_id": id
            },
            function(err, eventObj) {
                console.log(eventObj);
                db.User.findOneAndUpdate({
                        username: eventObj.owner
                    }, {
                        $pull: {
                            "events": eventObj.id
                        }
                    },
                    function(err, user) {
                        if (err) return res.send(500, {
                            error: err
                        });
                        eventObj.remove(function(err) {
                            if (err) throw err;
                        });
                    }
                );
            });
    },
    calculateCountdown: function(array) {
        console.log("calculateCountdown");
        time = new Date();
        for (let i = 0; i < array.length; i++) {
            array[i].countdown = time - (new Date(array[i].time));
        }
    },

    // formatCountdown: function(c) {
    //     let result = "";
    //     let date = new Date(c);
    //     console.log("formatting" + date.toDateString());
    //     if (c > 0) {
    //
    //     } else if (c == 0) {
    //         result = "Now";
    //     } else {
    //         result += 'Ago'
    //     }
    // },

    toDate: function(array) {
        for (let i = 0; i < array.length; i++) {
            let d = new Date(array[i].countdown);
            array[i].countdown = d.toLocaleString();
        }
    }
};

module.exports = {
    /**User Interactions**/
    signUp: function(req, res) {
        // With email, username and password (encrypted, decrypt here and save to db)
        //TODO: Deal with encryption/decryption, replace 'success' with standarized responses

        let newUser = new db.User(req.body);
        newUser.notification = false;
        db.User.findOne({
            username: newUser.username
        }, function(err, result) {
            if (err) {
                for (let field in err.errors) {
                    console.log(field);
                }
            }
            if (!result) {
                newUser.save(function(err) {
                    if (err) return res.send(500, {
                        error: err
                    });
                    // res.send('Success');
                    // res.redirect('/');
                    res.render('login.html', {
                        success: 'Successfully registered! Login now and doo on.'
                    });
                })
            } else {
                res.render('signup.html', {
                    error: 'Username Already exists'
                });
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
            username: req.body.username
        }, function(err, user) {
            console.log(user);
            if (user.password == req.body.password) {
                for (let i = 0; i < user.events.length; i++) {
                    helper.deleteEventHelper(user.events[i]);
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
        // email/username and password (encrypted, decrypt here and check with db)
        // TODO: Replace response msg with standarized responses
        //check if email exists
        db.User.findOne({
            email: req.body.username
        }, function(err, user) {
            if (err) throw err;
            if (user) {
                if (user.password == req.body.password) {
                    req.session.user_id = user._id;
                    req.session.username = user.username;
                    req.session.is_admin = user._doc.adminPrivilege;
                    res.redirect('/');
                } else {
                    return res.render('login.html', {
                        error: 'Username or password invalid. Please try again.'
                    });
                }
            } else {
                //check if username exists
                db.User.findOne({
                    username: req.body.username
                }, function(err, user) {
                    if (err) throw err;
                    if (user) {
                        if (user.password == req.body.password) {
                            req.session.user_id = user._id;
                            req.session.username = user.username;
                            req.session.is_admin = user._doc.adminPrivilege;
                            return res.redirect('/');
                        } else {
                            return res.render('login.html', {
                                error: 'Username or password invalid. Please try again.'
                            });
                        }
                    } else {
                        return res.render('login.html', {
                            error: 'Username or password invalid. Please try again.'
                        });
                    }

                });
            }

        });

    },

    logOut: function(req, res) {
        // clear session, return to main page
        req.session.destroy();
        res.redirect('/');
    },

    /* req.body format
        {
            "username": username,
            "event": {
                title,
                time,
                type，
                private
            }
        } */
    addEvent: function(req, res) {
        // With dates, event name, event type

        let newEvent = new db.Event(req.body);
        newEvent.owner = req.session.username;
        newEvent.save(function(err, newEvent) {
            if (err) throw err;
            // add event id to user
            db.User.findOneAndUpdate({
                    username: req.session.username
                }, {
                    $push: {
                        "events": newEvent.id
                    }
                },
                function(err, user) {
                    if (err) return res.send(500, {
                        error: err
                    });
                    db.Event.find({
                        "owner": req.session.username
                    }, function(err, result) {
                        if (err) {
                            throw err
                        }
                        helper.calculateCountdown(result);
                        result.sort(function(a, b) {
                            return new Date(a.countdown) - new Date(b.countdown);
                        });
                        // helper.toDate(result);
                        return res.render('index.html', {
                            events: result,
                            new: newEvent.id
                        });
                    });
                });
        });
    },


    /* req.body format
    {
        "event": id
    } */
    //TODO:verify if user is the owner by session
    deleteEvent: function(req, res) {
        // With dates, event name, event type
        db.Event.findOne({
            "_id": req.body.event
        }, function(err, eventObj) {
            if (req.session.username == eventObj.owner) {
                helper.deleteEventHelper(req.body.event);
                res.send("success");
            } else {
                return res.send(500, {
                    error: "Permission denied."
                });
            }
        });
    },

    /* req.body format
    {
      event: id
    } */
    getEvent: function(req, res) {
        console.log(req.query.event);
      db.Event.findOne({

        "_id":req.query.event
      }, function(err, eventObj) {
        console.log(eventObj);
        if (err) throw err;
        if (eventObj) {
        //   req.session.event_id           = eventObj._id;
        //   req.session.event_title        = eventObj.title;
        //   req.session.event_time         = eventObj.time;
        //   req.session.event_owner        = eventObj.owner;
        //   req.session.event_type         = eventObj.type;
        //   req.session.event_private      = eventObj.private;
        //   req.session.event_notification = eventObj.notification;
        //   req.session.event_value        = eventObj.value;
        //   req.session.event_share        = eventObj.share;
        //   req.session.event_comments     = eventObj.comments;

          return res.render('singleEvent.html', {
              event: eventObj
          })
        } else {
          console.log("Error: getEvent failed.");
        }
      });
    },

    /* req.body format
    {
        "event" : {
            id,
            title,
            time,
            type,
            private
        }
    }
    */

    editEvent: function(req, res) {
        // With dates, event name, event type
        db.Event.findOneAndUpdate({
            _id: req.body.event.id
        }, {
            $set: req.body.event
        }, function(err, event) {
            if (err) {
                return res.send(500, {
                    error: err
                })
            }
            event.save();
            res.send('Success');
        })
    },

    // req.body format:
    // {
    //     "username":username;
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
            username: req.body.username
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
    //         "username":username;
    //         "following":username
    //     }
    follow: function(req, res) {
        // add the person to current user's 'following' property
        // add the current user to the person's 'followedBy' property
        //TODO:handle duplicate follower
        db.User.findOneAndUpdate({
            username: req.body.username
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
            username: req.body.following
        }, {
            $push: {
                "followedBy": req.body.username
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
        db.User.findOneAndUpdate({
            username: req.body.username
        }, {
            $pull: {
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
            username: req.body.following
        }, {
            $pull: {
                "followedBy": req.body.username
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

    showFollowedEvents: function() {
        // get followed people from 'following' property
        // return their events
    },


    // rea.body:
    // {
    //     "username":username
    // }
    // res.send(
    // {
    //     "events":[{
    //             title:title
    //             time:July 28, 1996 8:00 PM
    //             type:type
    //             private:false
    //             comments:Array[0]
    //             share:0
    //             value:0
    //             notification:false
    //         },
    //         {
    //             title:title
    //             time:July 28, 1996 8:00 PM
    //             type:type
    //             private:false
    //             comments:Array[0]
    //             share:0
    //             value:0
    //             notification:false
    //         }]
    // })
    getEvents: function(req, res) {
        db.Event.find({
            "owner": req.body.username
        }, function(err, events) {
            if (err) {
                throw err
            }
            // res.send({"events":events});
            res.render('index.html', {
                "events": events
            });
        })
    },


    plusOne: function() {
        // pass in event id, change +1 value
    },

    addTheDDLToMyList: function() {
        // add someone's deadline event to the current user's own list
    },

    /* req.body format
     * {  event: id,
     *    comment: {
     *      content
     *  }
     * }
     */

    comment: function(req, res) {
        let newComment = new db.Comment(req.body);
        console.log(req.body);
        newComment.owner = req.session.username;
        console.log(req.body.comment);
        console.log(newComment);
        newComment.save(function(err, newEvent) {
            if (err) throw err;
            db.Event.findOneAndUpdate({
                "_id": req.body.event
            }, {
                $push: {
                    "comments": newComment.id
                }
            }, function(err, event) {
                // newComment.save();
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

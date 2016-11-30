let db = require('../models/data');

let helper = {

    sortEvent: function(array) {
        let finished = [];
        let unfinished = [];
        helper.calculateCountdown(array);
        array.sort(function(a, b) {
            return a.countdown - b.countdown;
        });

        for (var i = 0; i < array.length; i++) {
            if (array[i].countdown > 0) {
                array[i].finished = true;
                finished.push(array[i]);
            } else {
                array[i].finished = false;
                array[i].countdown = 0 - array[i].countdown;
                unfinished.push(array[i]);
            }
        }
        finished.sort(function(a, b) {
            return a.countdown - b.countdown;
        });
        // console.log(finished);
        unfinished.sort(function(a, b) {
            return a.countdown - b.countdown;
        });
        // console.log("Unfinished");
        // console.log(unfinished);
        array = unfinished.concat(finished);
        return({result:array});
    },

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
        let time = new Date();
        for (let i = 0; i < array.length; i++) {
            // console.log(new Date(array[i].time + time.getTimezoneOffset()));
            array[i].countdown = time - (array[i].time);
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

    getAllEvents: function(req, res, newEvent) {
        let userArray = req.user.following.concat([req.user.username]);
        db.Event.find({
            "owner": {
                $in: userArray
            }
        }, function(err, events) {
            result = helper.sortEvent(events).result;
            console.log(result);
            res.render('index.html', {
                user: req.user,
                events: result,
                new: newEvent
            });
        });

    },
};

module.exports = {
    /**User Interactions**/
    signUp: function(req, res) {
        // With email, username and password (encrypted, decrypt here and save to db)
        //TODO: Deal with encryption/decryption, replace 'success' with standarized responses

        let newUser = new db.User(req.body);
        newUser.notification = false;

        db.User.register(new db.User(newUser), req.body.password, function(err) {
            if (err) {
                res.render('signup.html', {
                    error: 'Username Already exists'
                });

            } else {
                res.render('login.html', {
                    success: 'Successfully registered! Login now and doo on.'
                });
            }


        });
        // db.User.findOne({
        //     username: newUser.username
        // }, function(err, result) {
        //     if (err) {
        //         for (let field in err.errors) {
        //             console.log(field);
        //         }
        //     }
        //     if (!result) {
        //         newUser.save(function(err) {
        //             if (err) return res.send(500, {
        //                 error: err
        //             });
        //             // res.send('Success');
        //             // res.redirect('/');
        //             res.render('login.html', {
        //                 success: 'Successfully registered! Login now and doo on.'
        //             });
        //         })
        //     } else {
        //         res.render('signup.html', {
        //             error: 'Username Already exists'
        //         });
        //     }
        // });



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

        let username = req.body.username;
        db.User.authenticate()(username, req.body.password, function(err, user, options) {
            if (err) {
                console.log(err);
            }
            if (user === false) {
                res.render('login.html', {
                    error: 'Username or password invalid. Please try again.'
                });
            } else {
                req.login(user, function(err) {
                    if (err) console.log(err);
                    res.redirect('/');
                });
            }
        });

        // db.User.findOne({
        //     email: req.body.username
        // }, function(err, user) {
        //     if (err) throw err;
        //     if (user) {
        //         if (user.password == req.body.password) {
        //             req.session.user_id = user._id;
        //             req.session.username = user.username;
        //             req.session.is_admin = user._doc.adminPrivilege;
        //             res.redirect('/');
        //         } else {
        //             return res.render('login.html', {
        //                 error: 'Username or password invalid. Please try again.'
        //             });
        //         }
        //     } else {
        //         //check if username exists
        //         db.User.findOne({
        //             username: req.body.username
        //         }, function(err, user) {
        //             if (err) throw err;
        //             if (user) {
        //                 if (user.password == req.body.password) {
        //                     req.session.user_id = user._id;
        //                     req.session.username = user.username;
        //                     req.session.is_admin = user._doc.adminPrivilege;
        //                     return res.redirect('/');
        //                 } else {
        //                     return res.render('login.html', {
        //                         error: 'Username or password invalid. Please try again.'
        //                     });
        //                 }
        //             } else {
        //                 return res.render('login.html', {
        //                     error: 'Username or password invalid. Please try again.'
        //                 });
        //             }
        //
        //         });
        //     }
        //
        // });

    },
    /*
     * req.params {
     *     username:username
     * }
     */
    getUser: function(req, res) {
        console.log(req.params);
        db.User.findOne({
                username: req.params.username
            },
            function(err, user) {
                if (err) {
                    return res.send(500, {
                        error: err
                    });
                }
                console.log(user)
                db.Event.find({
                    "owner": req.params.username
                }, function(err, result) {
                    if (err) {
                        throw err
                    }
                    // res.send({"events":events});
                    // console.log(events);
                    user.eventsObjs = result;
                    console.log(user);
                    res.render('singleUser.html', {
                        targetUser: user,
                        events: result
                    });
                });
                // for (let i = 0; i < user.events.length; i++) {
                //
                // }
                // return res.render("singleUser.html", {
                //     targetUser:user
                // })
            });
    },

    logOut: function(req, res) {
        // clear session, return to main page
        req.logout();
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
        newEvent.owner = req.user.username;
        newEvent.save(function(err, newEvent) {
            if (err) throw err;
            // add event id to user
            db.User.findOneAndUpdate({
                    username: req.user.username
                }, {
                    $push: {
                        "events": newEvent.id
                    }
                },
                function(err, user) {
                    if (err) return res.send(500, {
                        error: err
                    });
                    // db.Event.find({
                    //     "owner": req.user.username
                    // }, function(err, result) {
                    //     if (err) {
                    //         throw err
                    //     }
                    //     helper.calculateCountdown(result);
                    //     result.sort(function(a, b) {
                    //         return new Date(a.countdown) - new Date(b.countdown);
                    //     });
                    //     // helper.toDate(result);
                    //     return res.render('index.html', {
                    //         user: req.user,
                    //         events: result,
                    //         new: newEvent.id
                    //     });
                    // });
                    helper.getAllEvents(req, res, newEvent.id);
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
            if ((req.user.username == eventObj.owner) ||
                (req.user.adminPrivilege)) {
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
        console.log(req.query.event); // Log the event id
        /* Find the event by id */
        db.Event.findOne({
            "_id": req.query.event
        }, function(err, eventObj) {
            if (err) throw err;
            console.log(eventObj); // Log the event contents
            /* If find the event */
            if (eventObj) {
                // let commentList = []
                //
                // for (var i = 0; i < eventObj.comments.length; i++) {
                //     let commentID = eventObj.comments[i]
                //     let temp = db.Comment.find({
                //         "_id": commentID
                //     }, function(err, commentObj) {
                //         if (err) throw err
                //         commentList.push(commentObj)
                //     });
                // }
                //
                // console.log(commentList)
                // return res.render('singleEvent.html', {
                //     event: eventObj,
                //     commentList: commentList
                // })

                db.Comment.find({
                    "event": req.query.event
                }, function(err, commentList) {
                    if (err) throw err;
                    for (let i = 0; i < commentList.length; i++) {
                        commentList[i].timestamp = new Date(parseInt(commentList[i]._id.toString().substring(0, 8), 16) * 1000);
                    }
                    commentList.sort(function(a, b) {
                        return new Date(b.timestamp) - new Date(a.timestamp);
                    });

                    return res.render('singleEvent.html', {
                        user: req.user,
                        event: eventObj,
                        commentList: commentList
                    })
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
        console.log(req.body);
        db.User.findOneAndUpdate({
            username: req.user.username
        }, {
            $set: req.body
        }, function(err, user) {
            if (err) {
                return res.render("settings.html", {
                    user: req.user,
                    error: err + ": Error! Cannot change your profile!"
                });
            }
            //save error handle
            user.name = req.body.name;
            return res.render("settings.html", {
                user: user,
                success: "Success!"
            });
            // user.save(function(err) {
            //     if (err) {
            //         return res.render("settings.html", {
            //             user: req.user,
            //             error: "Error! Cannot change your profile!2"
            //         });
            //     }
            //     return res.render("settings.html", {
            //         user: user,
            //         success: "Success!"
            //     });
            // });
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
            };
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
                };
                res.send("Success");
            });
        });
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


    // req.body:
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
    getAllEvents: function(req, res) {
        helper.getAllEvents(req, res)
    },
    // req.body:
    // {
    //     event:id;
    // }
    plusOne: function(req, res) {
        // pass in event id, change +1 value
        db.Event.findOne({
            "_id": req.body.event
        }, function(err, theEvent) {
            if (err) throw err;
            let username = req.user.username;
            console.log(theEvent.liked);
            console.log(username);
            //if cannot find
            if (theEvent.liked.indexOf(username) == -1) {
                console.log("Cannot find, liked+1, push user");
                db.Event.findOneAndUpdate({
                    "_id": req.body.event
                }, {
                    $inc: {
                        "value": 1
                    },
                    $push: {
                        "liked": username
                    }
                }, function(err, event) {
                    if (err) throw err;
                    console.log(event.value + 1);
                    return res.send("" + (event.value + 1));
                });
            } else { //if can find
                console.log("Can find, liked-1, pull user");
                db.Event.findOneAndUpdate({
                    "_id": req.body.event
                }, {
                    $inc: {
                        "value": -1
                    },
                    $pull: {
                        "liked": username
                    }
                }, function(err, event) {
                    if (err) throw err;
                    console.log(0 - event.value);
                    return res.send("" + (0 - (event.value - 1)));
                });
            }
        });
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
        newComment.owner = req.user.username;
        newComment.event = req.body.event;
        console.log(req.body);
        console.log(newComment);
        newComment.save(function(err, newComment) {
            if (err) throw err;
            db.Event.findOneAndUpdate({
                "_id": req.body.event
            }, {
                $push: {
                    "comments": newComment.id
                }
            }, function(err, event) {
                if (err) throw err;
                db.Event.findOne({
                    "_id": req.body.event
                }, function(err, eventObj) {
                    if (err) throw err
                    return res.send({
                        count: "" + eventObj.comments.length,
                        comment: newComment
                    })
                });
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

    //req.query:
    //  ?keyword: search username or name or email
    //  ?keyword: search eventTitle
    search: function(req, res) {
        // search by username/email/eventTitle/
        console.log(req.body.keyword);
        db.User.find({
            $or: [{
                "username": req.body.keyword
            }, {
                "name": req.body.keyword
            }, {
                "email": req.body.keyword
            }]
        }, function(err, users) {
            if (err) throw err;
            db.Event.find({
                $and: [{
                    "title": req.body.keyword
                }, {
                    "private": false
                }]
            }, function(err, events) {
                let r = {
                    "user": req.user,
                    "users": users,
                    "events": events
                }
                res.render("search.html", r);
            })
        })
    },

    /**Functions for Admin users**/
    deleteUsers: function() {
        // delete the selected users from database
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

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
        return ({
            result: array
        });
    },

    deleteEventHelper: function(id) {
        db.Event.findOne({
                "_id": id
            },
            function(err, eventObj) {
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
        let time = new Date();
        for (let i = 0; i < array.length; i++) {
            // console.log(new Date(array[i].time + time.getTimezoneOffset()));
            let tempTime = new Date(array[i].time);
            if (array[i].type == "anniversary") {
                tempTime.setUTCFullYear(time.getUTCFullYear());
            }
            array[i].countdown = time - tempTime;
        }
    },

    getAllEvents: function(req, res, newEvent) {
        // let userArray = req.user.following.concat([req.user.username]);
        // db.Event.find({
        //     "owner": {
        //         $in: userArray
        //     }
        // }, function(err, events) {
        //     let result = helper.sortEvent(events).result;
        //     res.render('index.html', {
        //         user: req.user,
        //         events: result,
        //         new: newEvent
        //     });
        // });
        db.Event.find({
            "owner": req.user.username
        }, function(err, events) {
            if (err) {
                return res.render('notFound.html', {
                    user: req.user,
                    error: "Error: cannot get event data for " + req.user.username
                });
            }
            db.Event.find({
                "owner": {
                    $in: req.user.following
                },
                "private": false
            }, function(err, followingEvent) {
                if (err) {
                    return res.render('notFound.html', {
                        user: req.user,
                        error: "Error: cannot get event data for " + req.user.username
                    });
                }
                let result = helper.sortEvent(followingEvent.concat(events));
                res.render('index.html', {
                    user: req.user,
                    events: result.result,
                    new: newEvent
                });
            });
        });
    },

    getSingleUserEvents: function(req, res) {
        db.Event.find({
            "owner": req.user.username
        }, function(err, events) {
            result = helper.sortEvent(events).result;
            res.render('singleUser.html', {
                user: req.user,
                events: result,
            });
        });
    },
    // http://jsfiddle.net/abdulrauf6182012/2Frm3/
    formatDate: function(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join('-');
    },
    // modified from http://stackoverflow.com/a/7423831
    parseTimezone: function(time, value) {
        var date = time;
        var targetTime = new Date(date);
        var timeZoneFromDB = value;
        var tzDifference = timeZoneFromDB * 60 + targetTime.getTimezoneOffset();
        return new Date(targetTime.getTime() + tzDifference * 60 * 1000);
    }
};

module.exports = {
    /**User Interactions**/
    signUp: function(req, res) {
        // With email, username and password (encrypted, decrypt here and save to db)
        //TODO: Deal with encryption/decryption, replace 'success' with standarized responses

        let newUser = new db.User(req.body);
        newUser.notification = false;
        if (req.body.username != /[a-zA-Z][a-zA-Z0-9]+/) {
            return  res.render("signup.html", {
                user: req.user,
                error: "Error: Username doesn't meet requirement!"
            });
        }
        if (req.body.password == req.body.rePassword) {
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
        } else {
            return res.render("signup.html", {
                user: req.user,
                error: "Error: Passwords didn't match"
            });
        }
    },
    //req.body
    // {
    //     "username":username;
    //     "password":password;
    // }
    deleteAccount: function(req, res) {
        // User voluntarily delete his/her own account, need to wipe out everything about him/her
        // from database
        if (req.user) {
            db.User.findOne({
                username: req.body.username
            }, function(err, user) {
                // console.log(user);
                if (err) {
                    return res.render('notFound.html', {
                        user: req.user,
                        error: 'User not found. Please try again.'
                    });
                }
                if (req.user.id == req.body.id || req.user.adminPrivilege) {
                    for (let i = 0; i < user.events.length; i++) {
                        helper.deleteEventHelper(user.events[i]);
                    }
                    user.remove(function(err) {
                        if (err) {
                            return res.render("notFound.html", {
                                user: req.user,
                                error: "Cannot delete the user. Please try again."
                            });
                        }
                        res.send("Success");
                    });
                } else {
                    res.send("Access denied");
                }
            });
        } else {
            res.render("notFound.html", {
                error: "Session timed out. Please Login."
            });
        }
    },

    logIn: function(req, res) {
        // email/username and password (encrypted, decrypt here and check with db)
        // TODO: Replace response msg with standarized responses
        //check if email exists

        let username = req.body.username;
        db.User.authenticate()(username, req.body.password, function(err, user, options) {
            if (err) {
                return res.render("notFound.html", {
                    error: "Cannot log the user in. Please try again."
                });
            }
            if (user === false) {
                res.render('login.html', {
                    error: 'Username or password invalid. Please try again.'
                });
            } else {
                req.login(user, function(err) {
                    if (err) {
                        return res.render("notFound.html", {
                            error: "Cannot log the user in. Please try again."
                        });
                    }
                    res.redirect('/');
                });
            }
        });
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
                    return res.render("notFound.html", {
                        error: "Cannot get the user. Please try again."
                    });
                }
                console.log(user)
                if (user) {
                    if (req.user && req.user.username == req.params.username) {
                        db.Event.find({
                            "owner": req.params.username
                        }, function(err, result) {
                            if (err) {
                                return res.render("notFound.html", {
                                    error: "Cannot get the user. Please try again."
                                });
                            }
                            // res.send({"events":events});
                            // console.log(events);
                            user.eventsObjs = result;
                            result = helper.sortEvent(result).result;
                            console.log(user);
                            res.render('singleUser.html', {
                                targetUser: user,
                                events: result,
                                user: req.user
                            });
                        });
                    } else {
                        db.Event.find({
                            "owner": req.params.username,
                            "private": false
                        }, function(err, result) {
                            if (err) {
                                return res.render("notFound.html", {
                                    error: "Cannot get the user. Please try again."
                                });
                            }
                            // res.send({"events":events});
                            // console.log(events);
                            user.eventsObjs = result;
                            result = helper.sortEvent(result).result;
                            console.log(user);
                            res.render('singleUser.html', {
                                targetUser: user,
                                events: result,
                                user: req.user
                            });
                        });
                    }
                } else {
                    res.render("notFound.html", {
                        user: req.user,
                        error: "Error: User not found"
                    })
                }


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
        if (req.user) {
            console.log(req.body);
            let newEvent = new db.Event(req.body);
            newEvent.owner = req.user.username;
            // var date = newEvent.time;
            // var targetTime = new Date(date);
            // var timeZoneFromDB = -5.00;
            // var tzDifference = timeZoneFromDB * 60 + targetTime.getTimezoneOffset();
            // newEvent.time = new Date(targetTime.getTime() + tzDifference * 60 * 1000);
            newEvent.time = helper.parseTimezone(newEvent.time, -5.00);
            newEvent.save(function(err, newEvent) {
                if (err) {
                    return res.render("notFound.html", {
                        error: "Error: Cannot add event."
                    });
                }
                // add event id to user
                db.User.findOneAndUpdate({
                        username: req.user.username
                    }, {
                        $push: {
                            "events": newEvent.id
                        }
                    },
                    function(err, user) {
                        if (err) {
                            return res.render("notFound.html", {
                                error: "Error: Cannot add event."
                            });
                        }
                        helper.getAllEvents(req, res, newEvent.id);
                    });
            });
        } else {
            res.render("notFound.html", {
                error: "Session timed out. Please Login."
            });
        }
    },


    /* req.body format
    {
        "event": id
    } */
    //TODO:verify if user is the owner by session
    deleteEvent: function(req, res) {
        // With dates, event name, event type
        if (req.user) {
            db.Event.findOne({
                "_id": req.body.event
            }, function(err, eventObj) {
                if (err) {
                    return res.render("notFound.html", {
                        error: "Error: Cannot delete the event."
                    });
                }
                if ((req.user.username == eventObj.owner) ||
                    (req.user.adminPrivilege)) {
                    helper.deleteEventHelper(req.body.event);
                    res.send("Success");
                } else {
                    return res.send("Permission denied.");
                }
            });
        } else {
            res.render("notFound.html", {
                error: "Error: Session timed out. Please Login."
            });
        }
    },

    getEvent: function(req, res) {
        console.log(req.params.event); // Log the event id
        /* Find the event by id */
        db.Event.findOne({
            "_id": req.params.event
        }, function(err, eventObj) {
            if (err) {
                return res.render("notFound.html", {
                    error: "Error: Cannot find event."
                });
            }
            console.log(eventObj); // Log the event contents
            /* If find the event */
            if (eventObj) {
                if (eventObj.private) {
                    if (req.user) {
                        if (req.user.username == eventObj.owner) {
                            db.Comment.find({
                                "event": req.params.event
                            }, function(err, commentList) {
                                if (err) {
                                    return res.render("notFound.html", {
                                        user:req.user,
                                        error: "Error: Failed to load comments."
                                    });
                                }
                                for (let i = 0; i < commentList.length; i++) {
                                    commentList[i].timestamp = new Date(parseInt(commentList[i]._id.toString().substring(0, 8), 16) * 1000);
                                }
                                commentList.sort(function(a, b) {
                                    return new Date(b.timestamp) - new Date(a.timestamp);
                                });
                                let time = new Date();
                                eventObj.countdown = (eventObj.time) - time;
                                return res.render('singleEvent.html', {
                                    user: req.user,
                                    event: eventObj,
                                    commentList: commentList
                                });
                            });
                        } else {
                            return res.render("notFound.html", {
                                user:req.user,
                                error: "Error: Permission denied."
                            });
                        }
                    } else {
                        return res.render("notFound.html", {
                            user:req.user,
                            error: "Error: Permission denied."
                        });
                    }
                } else {
                    db.Comment.find({
                        "event": req.params.event
                    }, function(err, commentList) {
                        if (err) {
                            return res.render("notFound.html", {
                                user:req.user,
                                error: "Error: Failed to load comments."
                            });
                        }
                        for (let i = 0; i < commentList.length; i++) {
                            commentList[i].timestamp = new Date(parseInt(commentList[i]._id.toString().substring(0, 8), 16) * 1000);
                        }
                        commentList.sort(function(a, b) {
                            return new Date(b.timestamp) - new Date(a.timestamp);
                        });
                        let time = new Date();
                        eventObj.countdown = (eventObj.time) - time;
                        return res.render('singleEvent.html', {
                            user: req.user,
                            event: eventObj,
                            commentList: commentList
                        });
                    });
                }

            }
        });
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
        if (req.user) {
            db.User.findOne({
                username: req.user.username
            }, function(err, user) {
                if (err) {
                    return res.render("settings.html", {
                        user: req.user,
                        error: "Error: Cannot change profile."
                    });
                }
                if (req.body.birthday && (req.body.birthday != "")) {
                    user.birthday = req.body.birthday;
                }
                if (req.body.name && (req.body.name != "")) {
                    user.name = req.body.name;
                }
                if (req.body.gender && (req.body.gender != "")) {
                    user.gender = req.body.gender;
                }
                if (req.body.color && (req.body.color != "")) {
                    console.log(req.body.color);
                    user.color = req.body.color;
                }
                user.save();
                return res.render("settings.html", {
                    user: user,
                    success: "Success!"
                });
            });
        } else {
            res.render("notFound.html", {
                error: "Error: Session timed out. Please Login."
            });
        }
    },
    /*
    * req.body format:
    * {
    *   "username": username,
    *   "newpassword": newpassword
    * }
    * */

    changePassword: function (req, res) {
        if(req.user){
            db.User.findOne({
                username: req.body.username
            }, function (err, user) {
                if(err){
                    return res.render("settings.html",{
                        user: req.user,
                        error: "Error: Cannot change password."
                    });
                }else{
                    if (req.body.password == req.body.rePassword) {
                        user.setPassword(req.body.password, function (err) {
                            if(!err){
                                user.save(function (err) {
                                    if(err){
                                        return res.render("settings.html",{
                                            user: req.user,
                                            error: "Error: Cannot change password."
                                        })
                                    }else{
                                        return res.render("settings.html", {
                                            user: user,
                                            success: "Success!"
                                        });
                                    }
                                })
                            }else{
                                return res.render("settings.html",{
                                    user: req.user,
                                    error: "Error: Cannot change password."
                                });
                            }
                        });
                    } else {
                        return res.render("settings.html", {
                            user: req.user,
                            error: "Error: Passwords didn't match"
                        });
                    }

                }
            })
        } else {
            res.render("notFound.html",{
                error: "Error: Session timed out. Please Login."
            })
        }
    },

    // req.body:
    //     {
    //         following: username
    //     }
    follow: function(req, res) {
        // add the person to current user's 'following' property
        // add the current user to the person's 'followedBy' property
        //TODO:handle duplicate follower

        if (req.user) {
            if (req.user.username == req.body.following) {
                return res.send("Error: Cannot follow yourself.");
            } else if (req.user.following.indexOf(req.body.following) != -1) {
                //if we have followed this user
                return res.send("Error: Duplicate follows.");
            } else {
                db.User.findOneAndUpdate({
                    username: req.user.username
                }, {
                    $push: {
                        "following": req.body.following
                    }
                }, function(err, user) {
                    if (err) {
                        return res.send("Error: Cannot follow.");
                    };
                    db.User.findOneAndUpdate({
                        username: req.body.following
                    }, {
                        $push: {
                            "followedBy": req.user.username
                        }
                    }, function(err, user) {
                        if (err) {
                            return res.send("Error: Cannot follow.");
                        };
                        res.send("Success");
                    });
                });
            }
        } else {
            res.render("notFound.html", {
                error: "Error: Session timed out. Please Login."
            });
        }

    },

    unFollow: function(req, res) {
        // remove this person from current user's 'following' property
        // remove the current user from the person's 'followedBy' property
        if (req.user) {
            db.User.findOneAndUpdate({
                username: req.user.username
            }, {
                $pull: {
                    "following": req.body.following
                }
            }, function(err, user) {
                if (err) {
                    return res.render("notFound.html", {
                        error: "Error: Cannot unfollow. Please try again."
                    });
                }
                db.User.findOneAndUpdate({
                    username: req.body.following
                }, {
                    $pull: {
                        "followedBy": req.user.username
                    }
                }, function(err, user) {
                    if (err) {
                        return res.render("notFound.html", {
                            error: "Error: User not found."
                        });
                    }
                    res.send("Success");
                });
            });
        } else {
            res.render("notFound.html", {
                error: "Error: Session timed out. Please Login."
            });
        }
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
        if (req.user) {
            db.Event.findOne({
                "_id": req.body.event
            }, function(err, theEvent) {
                if (err) {
                    return res.render("notFound.html", {
                        error: "Error: Event not found."
                    });
                }
                let username = req.user.username;
                console.log(theEvent.liked);
                console.log(username);
                //if cannot find
                if (theEvent.liked.indexOf(username) == -1) {
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
                        if (err) {
                            return res.render("notFound.html", {
                                error: "Error: Event not found."
                            });
                        }
                        console.log(event.value + 1);
                        return res.send("" + (event.value + 1));
                    });
                } else { //if can find
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
                        if (err) {
                            return res.render("notFound.html", {
                                error: "Error: Event not found."
                            });
                        }
                        console.log(0 - event.value);
                        return res.send("" + (0 - (event.value - 1)));
                    });
                }
            });
        } else {
            res.render("notFound.html", {
                error: "Session timed out. Please Login."
            });
        }
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
        if (req.user) {
            let newComment = new db.Comment(req.body);
            newComment.owner = req.user.username;
            newComment.event = req.body.event;
            console.log(req.body);
            console.log(newComment);
            newComment.save(function(err, newComment) {
                if (err) {
                    return res.render("notFound.html", {
                        error: "Error: Cannot save comment."
                    });
                }
                db.Event.findOneAndUpdate({
                    "_id": req.body.event
                }, {
                    $push: {
                        "comments": newComment.id
                    }
                }, function(err, event) {
                    if (err) {
                        return res.render("notFound.html", {
                            error: "Error: Event not found."
                        });
                    }
                    db.Event.findOne({
                        "_id": req.body.event
                    }, function(err, eventObj) {
                        if (err) {
                            return res.render("notFound.html", {
                                error: "Error: Event not found."
                            });
                        }
                        return res.send({
                            count: "" + eventObj.comments.length,
                            comment: newComment
                        })
                    });
                });
            });
        } else {
            res.render("notFound.html", {
                error: "Error: Session timed out. Please Login."
            });
        }
    },

    /* req.body format
     * {
     *   "comment": id,
     *   "event": id
     * }
     */
    deleteComment: function(req, res) {
        // delete one's own comment, delete the corresponding comment in this event
        if (req.user) {
            db.Comment.findOne({
                "_id": req.body.comment
            }, function(err, commentObj) {
                if (err) {
                    return res.render("notFound.html", {
                        user: req.user,
                        error: "Error: Comment not found."
                    });
                }
                db.Event.findOneAndUpdate({
                    "_id": req.body.event
                }, {
                    $pull: {
                        "comments": commentObj.id
                    }
                }, function(err, user) {
                    if (err) {
                        return res.render("notFound.html", {
                            user: req.user,
                            error: "Error: Event not found"
                        });
                    }
                    db.Comment.remove({
                        "_id": req.body.comment
                    }, function(err) {
                        if (err) {
                            res.render("notFound.html", {
                                user: req.user,
                                error: "Cannot delete comment."
                            });
                        }
                        res.send("Success");
                    });
                });

            });
        } else {
            res.render("notFound.html", {
                error: "Error: Session timed out. Please Login."
            });
        }
    },

    subscribeEmailNotificatino: function() {
        // future feature
    },

    //req.query:
    //  ?keyword: search username or name or email
    //  ?keyword: search eventTitle
    search: function(req, res) {
        // search by username/email/eventTitle/
        if (req.user) {
            console.log(req.body.keyword);
            let regExp = new RegExp(req.body.keyword, "i");
            db.User.find({
                $or: [{
                    "username": regExp
                }, {
                    "name": regExp
                }, {
                    "email": regExp
                }]
            }, function(err, users) {
                if (err) {
                    return res.render("notFound.html", {
                        error: "Error: Cannot access user database."
                    });
                }
                db.Event.find({
                    $and: [{
                        "title": regExp
                    }, {
                        "private": false
                    }]
                }, function(err, events) {
                    if (err) {
                        return res.render("notFound.html", {
                            error: "Error: Cannot access event database."
                        });
                    }
                    db.Event.find({
                        $and: [{
                            "owner": req.user.username
                        }, {
                            "title": regExp
                        }, {
                            "private": true
                        }]
                    }, function(err, privateEvents) {
                        if (err) {
                            return res.render("notFound.html", {
                                error: "Error: Cannot access event database."
                            });
                        }
                        let returnEvents = events.concat(privateEvents);
                        let r = {
                            user: req.user,
                            users: users,
                            events: returnEvents
                        }
                        console.log(r);
                        res.render("search.html", r);
                    })
                })
            });
        } else {
            res.render("notFound.html", {
                error: "Error: Session timed out. Please Login."
            });
        }
    },

    /**Functions for Admin users**/
    /* req.body:
        {
            users: ["username1", "username2"....]
        }
    *
    * */
    deleteUsers: function(req, res) {
        // delete the selected users from database
        if (req.user) {
            if (req.body.users.length == 0) {
                req.send('Error: No user selected');
            }
            req.body.users.forEach(function(username) {
                db.User.findOneAndRemove({
                    username: username
                }, function() {

                });
                db.Comment.remove({
                    owner: username
                }, function() {

                });
                db.Event.remove({
                    owner: username
                }, function() {

                });
            });
            res.send('Success');
        } else {
            res.render("notFound.html", {
                error: "Error: Session timed out. Please Login."
            });
        }
    },

    getEditEvent: function(req, res) {
        db.Event.findOne({
            "_id": req.params.event
        }, function(err, eventObj) {
            if (err) {
                return res.render("notFound.html", {
                    user: req.user,
                    error: "Error: Cannot find event id " + req.params.event + "."
                });
            }
            if (req.user) {
                if ((req.user.username == eventObj.owner) ||
                    (req.user.adminPrivilege)) {
                    res.render("editEvent.html", {
                        user: req.user,
                        event: eventObj
                    });
                } else {
                    return res.render("notFound.html", {
                        user: req.user,
                        error: "Error: Permission Denied."
                    });
                }
            } else {
                return res.render("notFound.html", {
                    user: req.user,
                    error: "Error: Please login to edit."
                });
            }

        });
    },

    /* req.body.format
        {
            event: id,
            title: ,
            time: ,
            type: ,
            private:
        }
        */
    editEvent: function(req, res) {
        console.log("+++++++++++++++++++++++++++++++++++++");
        console.log(req.body);
        db.Event.findOne({
            "_id": req.body.event
        }, function(err, eventObj) {
            if (err) {
                return res.render("editEvent.html", {
                    user: req.user,
                    event: eventObj,
                    error: "Error: Event not found."
                });
            }

            if (req.body.title && req.body.title != "") {
                eventObj.title = req.body.title;
            }
            if (req.body.time) {
                let newDate = req.body.time[0];
                let date = undefined;
                if (newDate != "") {
                    if (req.body.type == "deadline") {
                        date = new Date(newDate + "T" + req.body.time[1] +":00.000Z");
                    } else if (req.body.type == "anniversary") {
                        date = new Date(newDate);
                    } else {
                        date = new Date(newDate + "T" + eventObj.time.toTimeString().substr(0, 8) +".000Z");
                    }
                } else {
                    if (req.body.type == "deadline") {
                        date = new Date(helper.formatDate(eventObj.time) + "T" + req.body.time[1] +":00.000Z");
                    }
                }
                if (date) {
                    eventObj.time = helper.parseTimezone(date, 0.00);
                };
            }
            if (req.body.type && req.body.type != "") {
                eventObj.type = req.body.type;
            }
            if (req.body.private && req.body.private != "") {
                eventObj.private = req.body.private;
            }

            eventObj.save(function(err) {
                if (err) {
                    return res.render("notFound.html", {
                        user: req.user,
                        error: "Error: Cannot save changes.",
                    });
                }
                return res.render("editEvent.html", {
                    user: req.user,
                    event: eventObj,
                    success: "Success!"
                });
            });
            console.log(eventObj);
        });
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
            if (err) {
                return res.render("notFound.html", {
                    error: "Error: Comment not found"
                });
            }
            db.Event.findOneAndUpdate({
                "_id": req.body.event
            }, {
                $pull: {
                    "comments": commentObj.id
                }
            }, function(err, user) {
                if (err) {
                    return res.render("notFound.html", {
                        error: "Error: Cannot delete comment."
                    });
                }
            });
            commentObj.remove(function(err) {
                if (err) {
                    return res.render("notFound.html", {
                        error: "Error: Cannot delete comment."
                    });
                }
                res.send("Success");
            });
        });
    },

    getAdmin: function(req, res) {
        if (req.user) {
            if (req.user.adminPrivilege) {
                db.User.find({}, function(err, users) {
                    if(err) {
                        return res.render("notFound.html"), {
                            error: "Error: Cannot access user database"
                        }
                    }
                    usersMin = [];
                    for (let i = 0; i < users.length; i++) {
                        usersMin.push({
                            username: users[i].username,
                            email: users[i].email,
                            name: users[i].name,
                            adminPrivilege: users[i].adminPrivilege,
                            dateJoined: users[i]._id.getTimestamp()
                        });
                    }
                    db.Event.find({
                        private: false
                    }, function(err, events) {
                        if(err) {
                            return res.render("notFound.html"), {
                                error: "Error: Cannot access event database"
                            }
                        }
                        eventsMin = [];
                        for (let i = 0; i < events.length; i++) {
                            eventsMin.push({
                                id: events[i]._id,
                                idShort: events[i]._id.toString().substr(0, 6),
                                title: events[i].title,
                                time: events[i].time,
                                owner: events[i].owner
                            });
                        }
                        return res.render("admin.html", {
                            user:req.user,
                            users:usersMin,
                            events:eventsMin,
                            userCount: usersMin.length,
                            eventCount: eventsMin.length
                        });
                    });
                });
            } else {
                res.render("notFound.html", {
                    error: "Error: Access denied"
                });
            }
        } else {
            res.render("notFound.html", {
                error: "Error: Access denied"
            });
        }
    },

    createCommonEvents: function() {
        // create some sample/common events for the users to add in one click
    }


};

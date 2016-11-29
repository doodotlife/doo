let express = require('express');
let doo = require('./routes/routes');
let path = require('path');
let logger = require('morgan');
let bodyParser = require('body-parser');
let nunjucks = require('nunjucks');
let session = require('express-session');
let db = require('./models/data');
let passport = require('passport');
let LocalStrategy = require('passport-local').Strategy;


let app = express();
nunjucks.configure('views', {autoescape: true, express: app});

app.use(express.static(path.join(__dirname, 'assets')));
app.use(session({secret: 'doodoodoo'}));
app.use(logger('dev'));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(db.User.authenticate()));

passport.serializeUser(db.User.serializeUser());
passport.deserializeUser(db.User.deserializeUser());


app.use(function(req, res, next) {
    res.locals.session = req.session;
    next();
});
// The request body is received on GET or POST.
// A middleware that just simplifies things a bit.
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));


app.listen(3000, function () {
    console.log('Listening on port 3000');
});



/**Routing functions go here**/
// Get the index page:
app.get('/', (req, res) => {
    //console.log(req.user.username);
    if (req.user !== undefined) {
        // res.render('index.html');
        db.Event.find({
            "owner": req.user.username
        }, function(err, result) {
            if (err) {
                throw err
            }
            // res.send({"events":events});
            // console.log(events);
            res.render('index.html', {
                user: req.user,
                events: result
            });
        });
    } else {
        res.redirect('/login');
    }
});
app.get('/login', (req,res)=> {
    //console.log(req.user);
    if(req.user !==undefined){
        res.redirect('/');
        return;
    }
    res.render('login.html');
});

app.get('/signup', (req, res)=>{
    if(req.user!==undefined){
        res.redirect('/');
    } else {
        console.log("get signup");

        res.render('signup.html');
    }

});
app.post('/signup', doo.signUp);
app.delete('/account',doo.deleteAccount);

app.post('/login', doo.logIn);
app.get('/logout', doo.logOut);

app.post('/event', doo.addEvent);
app.delete('/event', doo.deleteEvent);
app.post('/events',doo.getEvents);
app.put('/editevent', doo.editEvent);

app.post('/plusone',doo.plusOne);

app.post('/comment', doo.comment);
app.delete('/comment', doo.deleteComment);

app.post('/profile',doo.editProfile);
app.post('/follow',doo.follow);
app.post('/unfollow',doo.unFollow);

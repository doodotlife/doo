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


app.listen(process.env.PORT||3000, function () {
    console.log('Listening on port 3000');
});



/**Routing functions go here**/
// Get the index page:
app.get('/', (req, res) => {
    //console.log(req.user.username);
    if (req.user !== undefined) {
        doo.getAllEvents(req, res);
    } else {
        res.redirect('/login');
    }
});

app.get('/login', (req,res)=> {
    //console.log(req.user);
    if(req.user !== undefined){
        res.redirect('/');
        return;
    }
    res.render('login.html');
});

app.get('/signup', (req, res)=>{
    if(req.user !== undefined){
        res.redirect('/');
    } else {
        console.log("get signup");
        res.render('signup.html');
    }

});
app.post('/signup', doo.signUp);
app.delete('/account',doo.deleteAccount);
app.get('/u/:username', doo.getUser);
app.get('/settings',  (req,res) => {
    if(req.user == undefined){
        res.redirect('/');
    } else {
        console.log("get settings");
        res.render('settings.html', {user:req.user});
    }
});

app.post('/login', doo.logIn);
app.get('/logout', doo.logOut);

app.get('/e/:event', doo.getEvent);
// app.get('/event', doo.getEvent);
app.post('/event', doo.addEvent);
app.delete('/event', doo.deleteEvent);
app.post('/events',doo.getAllEvents);
app.post('/editevent', doo.editEvent);
app.post('/changepassword', doo.changePassword);
app.get('/edit/:event', doo.getEditEvent);

app.post('/plusone',doo.plusOne);

app.get('/search', (req,res) => {
    if(req.user == undefined){
        res.redirect('/');
    } else {
        console.log("get search");
        res.render('search.html', {user:req.user});
    }
});

app.get('/admin', doo.getAdmin);

app.post('/search',doo.search);

app.post('/comment', doo.comment);
app.delete('/comment', doo.deleteComment);

app.post('/profile',doo.editProfile);
app.post('/follow',doo.follow);
app.post('/unfollow',doo.unFollow);

app.delete('/users', doo.deleteUsers);

app.all('*', function(req, res) {
  res.render("notFound.html", {
      user:req.user,
      error: "Error: 404 Not Found"
  });
});

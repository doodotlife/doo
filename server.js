let express = require('express');
let doo = require('./routes/routes');
let path = require('path');
let bodyParser = require('body-parser');
let nunjucks = require('nunjucks');
let session = require('express-session');


let app = express();
nunjucks.configure('views', {autoescape: true, express: app});

app.use(express.static(path.join(__dirname, 'assets')));
app.use(session({secret: 'doodoodoo'}));

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
app.get('/', (req,res)=> {
    console.log(req.session.username);
    if(req.session.username !==undefined){
        res.render('index.html');
    } else {
        res.redirect('/login');
    }
});

app.get('/login', (req,res)=> {
    console.log(req.session.username);
    if(req.session.username !==undefined){
        res.redirect('/');
        return;
    }
    res.render('login.html');
});

app.get('/signup', (req, res)=>{
    if(req.session.username !==undefined){
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

app.post('/comment', doo.comment);
app.delete('/comment', doo.deleteComment);

app.post('/profile',doo.editProfile);
app.post('/follow',doo.follow);
app.post('/unfollow',doo.unFollow);

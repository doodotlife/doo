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
    res.render('index.html');
});


app.post('/signup', doo.signUp);
app.post('/login', doo.logIn);
app.get('/logout', doo.logOut);

app.post('/event', doo.addEvent);
app.delete('/event', doo.deleteEvent);

app.post('/comment', doo.comment);
app.post('/profile',doo.editProfile);
app.post('/follow',doo.follow);
app.delete('/account',doo.deleteAccount);

app.listen(3000);
console.log('Listening on port 3000');

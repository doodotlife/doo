let express = require('express');
let doo = require('./routes/routes');
let bodyParser = require('body-parser');


let app = express();

app.use(express.static(__dirname + '/assets'));
app.use(express.static(__dirname + '/'));


// The request body is received on GET or POST.
// A middleware that just simplifies things a bit.
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));



/**Routing functions go here**/
// Get the index page:
app.get('/', (req,res)=> {
    res.sendfile('index.html');
});

app.post('/signup', doo.signUp);
app.post('/login', doo.logIn);
app.get('/logout', doo.logOut);



app.listen(3000);
console.log('Listening on port 3000');

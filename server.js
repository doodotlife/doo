var express = require('express');
var tas = require('./routes/routes');
var bodyParser = require('body-parser');


var app = express();

app.use(express.static(__dirname + '/assets'));
app.use(express.static(__dirname + '/'));


// The request body is received on GET or POST.
// A middleware that just simplifies things a bit.
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

// Get the index page:
app.get('/', function(req, res) {
    res.sendfile('index.html');
});

app.get('/applicants', tas.findApplicants);
app.post('/applicants', tas.addApplicant);
app.delete('/applicants', tas.delApplicant);
app.get('/courses', tas.findCourses);
app.get('/coursearray', tas.getCourseArray);

app.listen(3000);
console.log('Listening on port 3000');

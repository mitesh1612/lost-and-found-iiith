var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://localhost:27017/users');
var db = mongoose.connection;
var session = require('express-session');
var routes = require('./imagefile');
var MongoStore = require('connect-mongo')(session);
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Database Connected!');
});

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname));
app.use(express.static(__dirname+'/views'));
app.set('view engine','ejs');
app.use(session({
  secret:'swati rocks',
  resave:true,
  saveUnitialized: false,
  store: new MongoStore({
    mongooseConnection: db
  })
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(express.static(__dirname+'/index.html'));
var routes = require('./router');
app.use('/',routes);
var server = app.listen(5000, function () {
  var host = server.address().address
  var port = server.address().port
  console.log("App Listening on Port 5000");
});

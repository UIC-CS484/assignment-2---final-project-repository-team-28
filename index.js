const express    = require('express'); 
const path       = require("path");
const user       = require('./dao/user.js');
const conn       = require('./dao/db_connection.js')
const session    = require("express-session");
const passport   = require('passport');
const LocalStrategy = require("passport-local").Strategy;
var SQLiteStore  = require('connect-sqlite3')(session);
const sqlite3    = require('sqlite3').verbose();
const { open }   = require('sqlite');
require('dotenv').config();


const app = express();
const port = process.env.PORT || 5000; 

(async () => {
  conn.db_connection.connectionAsync = await open({
    filename: './filmie.db',
    driver: sqlite3.Database
  })
})()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  express.static(path.join(__dirname, "./client/build"))
);
app.use(function(req, res, next) {
  console.log(req.body); next();
})

var session_config = {
  secret: 'secret', //a random unique string key used to authenticate a session
  resave: true, //enables the session to be stored back to the session store, even if the session was never modified during the request
  saveUninitialized: true, //this allows any uninitialized session to be sent to the store. When a session is created but not modified, it is referred to as uninitialized.
  cookie: { secure: true }, //true is a recommended option. However, it requires an https-enabled website
  store: new SQLiteStore({db:"filmie.db"}), //store  parameter when saving session to database
  cookie: {
    maxAge: 604800 * 4,
  },
};

session_config.cookie.secure = false;
//IMPORTANT REVIEW IN CLASS - https://expressjs.com/en/resources/middleware/session.html

//Express Sessions
app.use(session(session_config))
//Reference for above - https://www.section.io/engineering-education/session-management-in-nodejs-using-expressjs-and-express-session/

passport.use(
  new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  function(username, password, cb) {
    user.authenticate(username, password, cb);
  }
));

passport.serializeUser((user, done) => {
  return done(null, user.id);
});

passport.deserializeUser((userId, done) => {
  user.findById(userId, done)
})

//Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(require('./routes/homepage'))
app.use(require('./routes/profile'))
app.use(require('./routes/login'))
app.use(require('./routes/loginFail'))
app.use(require('./routes/register'))/*
app.use(require('./routes/search'))*/

app.get('/', (req, res) => {
  res.sendFile(
    path.join(__dirname, "../client/build/index.html"));
});

app.listen(port, () => console.log(`Listening on port ${port}`)); 

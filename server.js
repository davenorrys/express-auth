'use strict';
const routes      = require('./Routes.js')
const auth      = require('./Auth.js')
const express     = require('express');
const bodyParser  = require('body-parser');
const fccTesting  = require('./freeCodeCamp/fcctesting.js');

const app = express();

const mongo = require('mongodb').MongoClient


fccTesting(app); //For FCC testing purposes

app.set('view engine', 'pug')
app.use('/public', express.static(process.cwd() + '/public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.route('/')
  .get((req, res) => {
    res.render(__dirname + '/views/pug/index.pug', {title: 'Home Page', message: 'Please login', showLogin: true, showRegistration: true});
  });

mongo.connect(process.env.MONGODB_URL, (err, db)=>{
  if (err) console.log('Database error')
  else {
    console.log('Successful database connection')
    
    auth(app, db)
    routes(app, db)
    
    app.listen(process.env.PORT || 3000, () => {
      console.log("Listening on port " + process.env.PORT);
    });
  }
})

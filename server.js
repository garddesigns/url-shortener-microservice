'use strict';

var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var cors = require('cors');

var app = express();

// Basic Configuration 
var port = process.env.PORT || 3000;

/** this project needs a db !! **/ 
mongoose.connect(process.env.MONGOLAB_URI);

app.use(cors());

/** this project needs to parse POST bodies **/
// you should mount the body-parser here

app.use(bodyParser.urlencoded({extended: true}));

app.use('/public', express.static(process.cwd() + '/public'));

var Schema = mongoose.Schema;

var urlSchema = new Schema({
  'original_url': String,
  'short_url': Number
})

var Url = mongoose.model('Url', urlSchema);

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});

app.post('/api/shorturl/new', function(req, res){
  
  
  Url.count({}, function(err, count){
    var url = new Url({'original_url': req.body.url, 'short_url':count + 1})
    url.save(function(err, data){
      if(err) throw err;
      console.log(data)
    })
    res.json({'original_url': req.body.url, 'short_url':count + 1})
  })
})
  
// your first API endpoint... 
app.get("/api/shorturl/:url", function (req, res) {
  var url = Url.findOne({'short_url': req.params.url}, function(err,data){
    if(err) throw err;
    res.redirect(data.original_url)
  });
});


app.listen(port, function () {
  console.log('Node.js listening ...');
});
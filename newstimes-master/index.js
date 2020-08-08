const express = require('express');
const app = express();
const exphbs = require('express-handlebars');
const NewsAPI = require('newsapi');
const newsapi = new NewsAPI('71eff7133ea047e4b4758c8299b5ccda');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local'),Strategy;
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/loginapp',{ useNewUrlParser: true });

var db = mongoose.connection;

const PORT = 3000;
var routes = require('./routes/dash');
var users = require('./routes/users');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/static', express.static('public'));

const hbs = exphbs.create({
    extname: '.hbs'
});

app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');

//Express Session
app.use(session({
    secret:'secret',
    saveUninitialized: true,
    resave: true
  }));
  
  //Passport init
  app.use(passport.initialize());
  app.use(passport.session());
  
  const { check, validationResult } = require('express-validator');
  
  /*app.post('/user', [
    // username must be an email
    check('username').isEmail(),
    // password must be at least 5 chars long
    check('password').isLength({ min: 5 })
  ], (req, res) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
  
    User.create({
      username: req.body.username,
      password: req.body.password
    }).then(user => res.json(user));
  }); */
   //Connect Flash
   app.use(flash());
  
   //Global Vars
   app.use(function(req,res,next){
       res.locals.success_msg = req.flash('success_msg');
       res.locals.error_msg = req.flash('error_msg');
       res.locals.error = req.flash('error');
       res.locals.user = req.user || null;
       next();
  });
  
  app.use('dashboard',routes);
  app.use('/users',users);
  
  
  var currentdate = new Date();
  var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  var datetime = (days[currentdate.getDay()])+" , "+currentdate.getDate() + "  "
          + (months[currentdate.getMonth()])  + "  " 
          + currentdate.getFullYear();
  
   app.get('/aboutus', function (req, res) {
    res.render('about',{ 
    title: 'About us',
    date: datetime
    })
  })
  
  /*app.get('/users/register', function (req, res) {
    res.render('signup',{ 
    title: 'Signup',
    date: datetime
    })
  }) */
  var searchresult;
  app.get('/search', function (req, res) { 
    newsapi.v2.everything({
      q: req.query.s,
      language: 'en',
      page: 2
    }).then(response => {   
      searchresult =  response;
      res.render('catogory', {
        title: 'search',
        date: datetime,
        news: response.articles
        });
      }); 
  });
  
    var slidernews=[];
    var asideslidernews =[];      
    var bellowslidernews =[];            
    var s2VCnews =[];
    var topnews;
    newsapi.v2.topHeadlines({
      language: 'en',
      country: 'in'
      }).then(response => {
        //console.log(news);
        for(var i = 0; i<5; i++)
        {
          //var c = response.articles[i].content.substr(0, 6);
          slidernews.push(response.articles[i]);
          //news.push(response.articles[i]);
          //news.push(response.articles[i].content = c);
        }
        for(var i = 5; i<9; i++)
        {
          asideslidernews.push(response.articles[i]);
        }
        for(var i = 9; i<14; i++)
        {
          bellowslidernews.push(response.articles[i]);
        }      
        for(var i = 14; i<17; i++)
        {
          s2VCnews.push(response.articles[i]);
        }
        topnews = {
          //news: news,
          slidernews: slidernews,
          asideslidernews: asideslidernews,
          bellowslidernews: bellowslidernews,
          s2VCnews: s2VCnews
        }  
      });
        
    var businessnews1 = [];
    var businessnews2=[];  
    var businessnews;      
    newsapi.v2.topHeadlines({
      category: 'business',
      language: 'en',
      country: 'in'
      }).then(re => {        
      //console.log(news);
      for(var i = 0; i<4; i++)
      {
        //var c = response.articles[i].content.substr(0, 6);
        businessnews1.push(re.articles[i]);
        //news.push(response.articles[i].content = c);
      }
      for(var i = 4; i<8; i++)
      {
        businessnews2.push(re.articles[i]);
      }
      businessnews = {
      businessnews1: businessnews1,
      businessnews2: businessnews2
      };
    });
  
    var entertainment1 = [];
    var entertainment2 = [];  
    var entertainment;      
    newsapi.v2.topHeadlines({
      category: 'entertainment',
      language: 'en',
      country: 'in'
      }).then(re => {        
      //console.log(news);
      for(var i = 0; i<5; i++)
      {
        //var c = response.articles[i].content.substr(0, 6);
        entertainment1.push(re.articles[i]);
        //news.push(response.articles[i].content = c);
      }
      for(var i = 5; i<8; i++)
      {
        entertainment2.push(re.articles[i]);
      }
      entertainment = {
      entertainment1: entertainment1,
      entertainment2: entertainment2
      };
    });
  
    var technology1 = [];
    var technology2 = [];  
    var technology;      
    newsapi.v2.topHeadlines({
      category: 'technology',
      language: 'en',
      country: 'in'
      }).then(re => {        
      //console.log(news);
      for(var i = 0; i<4; i++)
      {
        //var c = response.articles[i].content.substr(0, 6);
        technology1.push(re.articles[i]);
        //news.push(response.articles[i].content = c);
      }
      for(var i = 4; i<8; i++)
      {
        technology2.push(re.articles[i]);
      }
      technology = {
        technology1: technology1,
        technology2: technology2
      };
    });
  
    var sports1 = [];
    var sports2 = [];  
    var sports;      
    newsapi.v2.topHeadlines({
      category: 'sports',
      language: 'en',
      country: 'in'
      }).then(re => {        
      //console.log(news);
      for(var i = 0; i<5; i++)
      {
        //var c = response.articles[i].content.substr(0, 6);
        sports1.push(re.articles[i]);
        //news.push(response.articles[i].content = c);
      }
      for(var i = 5; i<8; i++)
      {
        sports2.push(re.articles[i]);
      }
      sports = {
        sports1: sports1,
        sports2: sports2
      };
    });
  
  app.get('/', function (req, res) {         
    res.render('home', {
      title: 'newstimes',
      date: datetime,
      topnews: topnews,
      businessnews: businessnews,
      entertainment: entertainment,
      technology: technology,
      sports: sports
    });
  });
  
  
  app.get('/detailnews', function (req, res) { 
    var url = req.query.url;
    var newsarticle;
      //Iterate through NEWS at slider
      for(var i = 0; i < slidernews.length; i++) {
        if(url == slidernews[i].url) {
          newsarticle = slidernews[i];
        }
      }
      //Iterate through NEWS at Asideslidernews
      for(var i = 0; i < asideslidernews.length; i++) {
        if(url == asideslidernews[i].url) {
          newsarticle = asideslidernews[i];
        }
      }
      //Iterate through NEWS at bellowslidernews
      for(var i = 0; i < bellowslidernews.length; i++) {
        if(url == bellowslidernews[i].url) {
          newsarticle = bellowslidernews[i];
        }
      }
      //Iterate through NEWS at s2VCnews
      for(var i = 0; i < s2VCnews.length; i++) {
        if(url == s2VCnews[i].url) {
          newsarticle = s2VCnews[i];
        }
      }
      //Iterate through NEWS at businessnews1
      for(var i = 0; i < businessnews1.length; i++) {
        if(url == businessnews1[i].url) {
          newsarticle = businessnews1[i];
        }
      }
      //Iterate through NEWS at businessnews2
      for(var i = 0; i < businessnews2.length; i++) {
        if(url == businessnews2[i].url) {
          newsarticle = businessnews2[i];
        }
      }
      //Iterate through NEWS at entertainment1
      for(var i = 0; i < entertainment1.length; i++) {
        if(url == entertainment1[i].url) {
          newsarticle = entertainment1[i];
        }
      }
      //Iterate through NEWS at entertainment2
      for(var i = 0; i < entertainment2.length; i++) {
        if(url == entertainment2[i].url) {
          newsarticle = entertainment2[i];
        }
      }
      //Iterate through NEWS at technology1
      for(var i = 0; i < technology1.length; i++) {
        if(url == technology1[i].url) {
          newsarticle = technology1[i];
        }
      }
      //Iterate through NEWS at technology2
      for(var i = 0; i < technology2.length; i++) {
        if(url == technology2[i].url) {
          newsarticle = technology2[i];
        }
      }
      //Iterate through NEWS at sports1
      for(var i = 0; i < sports1.length; i++) {
        if(url == sports1[i].url) {
          newsarticle = sports1[i];
        }
      }
      //Iterate through NEWS at sports2
      for(var i = 0; i < sports2.length; i++) {
        if(url == sports2[i].url) {
          newsarticle = sports2[i];
        }
      }
      var fcontent = newsarticle.content;
      if(fcontent) {
        fcontent = fcontent.substr(0, 260);
      } else {
        fcontent = " ";
      }
      res.render('detailnews', {
        title: 'newstimes',
        date: datetime,
        newsarticle: newsarticle,
        fcontent: fcontent
      });
      
    });
  var cbnews;
    newsapi.v2.topHeadlines({
      language: 'en',
      category: 'business',
      country: 'in',
    }).then(response => { 
        cbnews = response;
    });
  
  var ctnews;
    newsapi.v2.topHeadlines({
      language: 'en',
      category: 'technology',
      country: 'in',
  }).then(response => {            
    ctnews = response;
  });
  
  var cenews;
  newsapi.v2.topHeadlines({
    language: 'en',
    category: 'entertainment',
    country: 'in',
  }).then(response => {  
    cenews = response;
  });
  
  var csnews;
  newsapi.v2.topHeadlines({
    country:"in",
    category: 'sport',
    language: 'en'
  }).then(response => {
    csnews = response;
  });
  
  
  
  app.get('/business' , function(req, res){
    res.render('catogory',{    
      title: 'business',
      date: datetime,
      news: cbnews.articles})
  });
  
  app.get('/technologies' , function(req, res){
    res.render('catogory',{   
      title: 'technologies',
      date: datetime,    
      news: ctnews.articles})
  });
  
  app.get('/entertainment' , function(req, res){
    res.render('catogory',{      
      title: 'entertainment',
      date: datetime,    
      news: cenews.articles});
  });
  
  app.get('/sports' , function(req, res){
    res.render('catogory',{         
      title: 'sports',
      date: datetime,    
      news: csnews.articles});
  });
  
  app.get('/cdetailnews', function (req, res) {
    var url = req.query.url;
    var newsarticle;
    //console.log(cbnews.articles);
      //Iterate through NEWS at business category page
      for(var i = 0; i < cbnews.articles.length; i++) {
        //console.log(cbnews.articles.length);
        if(url == cbnews.articles[i].url) {
          newsarticle = cbnews.articles[i];
        }
      }
      //Iterate through NEWS at tech catagory page
      for(var i = 0; i < ctnews.articles.length; i++) {
        if(url == ctnews.articles[i].url) {
          newsarticle = ctnews.articles[i];
        }
      }
      //Iterate through NEWS at Entertainment catagory page
      for(var i = 0; i < cenews.articles.length; i++) {
        if(url == cenews.articles[i].url) {
          newsarticle = cenews.articles[i];
        }
      }
      //Iterate through NEWS at Sports catagory page searchresult
      for(var i = 0; i < csnews.articles.length; i++) {
        if(url == csnews.articles[i].url) {
          newsarticle = csnews.articles[i];
        }
      }
      //console.log(searchresult);
      //Iterate through NEWS at searchresult
      if(searchresult) {
        for(var i = 0; i < searchresult.articles.length; i++) {
          if(url == searchresult.articles[i].url) {
            newsarticle = searchresult.articles[i];
          }
        }
      }
      
      var fcontent = newsarticle.content;
      if(fcontent) {
        fcontent = fcontent.substr(0, 260);
      } else {
        fcontent = " ";
      }  
      
      res.render('detailnews', {
        title: 'newstimes',
        date: datetime,
        newsarticle: newsarticle,      
        fcontent: fcontent
      });
  });

app.listen(PORT, function(){    
    console.log("App started at Port ", PORT);    
});
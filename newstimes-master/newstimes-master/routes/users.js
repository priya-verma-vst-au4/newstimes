var express = require('express');
var router = express.Router();
var User = require('../models/user');
var passport = require('passport');
var LocalStrategy = require('passport-local'),Strategy;
var expressValidator = require('express-validator');
const { check, validationResult } = require('express-validator');
var app = express();

var currentdate = new Date();
var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
var datetime = (days[currentdate.getDay()])+" , "+currentdate.getDate() + "  "
        + (months[currentdate.getMonth()])  + "  " 
        + currentdate.getFullYear();

//Register 
router.get('/register',function(req,res){
    res.render('signup', { 
      title: 'signup',
      date: datetime
      });
});

//Login
router.get('/login',function(req,res){
    res.render('login', { 
      title: 'Login',
      date: datetime
      });
});

router.get('/dashboard',ensureAuthenticated,function(req,res){
  
  res.render('dashboard', {
    title: 'Dashboard',
    date: datetime,
    userinfo: req.user });
});

function ensureAuthenticated(req,res,next){
  if(req.isAuthenticated()){
       return next();
  }else{
      req.flash('error_msg','You are not logged in');
      res.redirect('/users/login');
  }
}

//Register User 
router.post('/register',function(req,res){
  
    var name = req.body.name;
    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;
    var password2 = req.body.password2;
    var verror;
    //Validation
   /* check('name','Nmae is required').notEmpty();
    check('email','Email is required').notEmpty();
    check('email','Email is not valid').isEmail();
    check('username','Username is required').notEmpty();
    check('password','Password is required').notEmpty();
    check('password2','Passwords is required').equals(req.body.password);*/
    if(!name){
      verror = {
        msg: "Please Enter Name..."
      }
      
    } else if(!username){
      verror = {
        msg: "Please Enter username..."
      }
      
    } else if(!email){
      verror = {
        msg: "Please Enter email..."
      }
      
    } else if(!password){
      verror = {
        msg: "Please Enter password..."
      }
      
    } else if(!password2){
      verror = {
        msg: "Please Enter field confirm password..."
      }
      
    }
    
    if(verror){
      
        res.render('signup',{
            errors: verror
        });
    }else{
        var newUser = new User({
            name:name,
            email:email,
            username:username,
            password:password

        });
        User.createUser(newUser,function(err,user){
            if(err) throws(err);
            console.log(user);
        });
        req.flash('sucess_msg','You are registered and now can login');
        res.redirect('/users/login'); 
    }
});

passport.use(new LocalStrategy(
    function(username, password, done) {
      User.getUserByUsername(username,function(err,user){
          if(err) throw(err);
          if(!user){
              return done(null,false,{message:'Unknown User'});
          }
          User.comparePassword(password,user.password,function(err,isMatch){
              if(err) throw(err);
              if(isMatch){
                  return done(null,user);
              }else{
                  return done(null,false,{message:'Invalid password'});              
                }
          });
      
      });
    }
  ));

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    User.getUserById(id, function(err, user) {
      done(err, user);
    });
  });

router.post('/login',
  passport.authenticate('local',{successRedirect:'dashboard',failureRedirect:'/users/login',failureFlash: true}),
  function(req, res) {
    console.log("I am in post login");
    // If this function gets called, authentication was successful.
    // `req.user` contains the authenticated user.
    res.redirect('/users/' + req.user.username);
  });

  router.get('/logouT',function(req,res){
      req.logout();
      //req.flash('success_msg','You are logged out');
      res.redirect('/users/login');
  });

module.exports = router;